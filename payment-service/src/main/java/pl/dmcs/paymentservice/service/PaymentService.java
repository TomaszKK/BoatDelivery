package pl.dmcs.paymentservice.service;

import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dmcs.paymentservice.config.RabbitMQConfig;
import pl.dmcs.paymentservice.dto.PaymentEvent;
import pl.dmcs.paymentservice.dto.PaymentRequest;
import pl.dmcs.paymentservice.model.PaymentStatus;
import pl.dmcs.paymentservice.model.PaymentTransaction;
import pl.dmcs.paymentservice.repository.PaymentTransactionRepository;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Charge;



import java.math.BigDecimal;

@Service
public class PaymentService {

    private final PaymentTransactionRepository transactionRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public PaymentService(PaymentTransactionRepository transactionRepository, RabbitTemplate rabbitTemplate) {
        this.transactionRepository = transactionRepository;
        this.rabbitTemplate = rabbitTemplate;
    }


    @Transactional
    public String createPaymentSession(PaymentRequest request) throws StripeException {
        PaymentTransaction transaction = transactionRepository.findByOrderId(request.orderId()).orElse(null);

        if (transaction != null) {
            if (transaction.getStatus() == PaymentStatus.PAID) {
                throw new IllegalStateException("To zamówienie zostało już opłacone!");
            }

        } else {
            transaction = PaymentTransaction.builder()
                    .orderId(request.orderId())
                    .amount(request.amount())
                    .currency("PLN")
                    .status(PaymentStatus.PENDING)
                    .build();
        }

        long amountInCents = request.amount().multiply(new BigDecimal("100")).longValue();

        String successUrl = frontendUrl + "/payment/success";
        String cancelUrl = frontendUrl + "/payment/cancel";

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .setCustomerEmail(request.customerEmail())
                .putMetadata("order_id", request.orderId().toString())
                .setInvoiceCreation(SessionCreateParams.InvoiceCreation.builder().setEnabled(true).build())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("PLN")
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Zamówienie nr: " + request.orderId().toString().substring(0,8))
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);

        transaction.setStripeSessionId(session.getId());
        transaction.setStatus(PaymentStatus.PENDING);

        transactionRepository.saveAndFlush(transaction);

        return session.getUrl();
    }

    @Transactional
    public void processStripeWebhook(String payload, String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Nieprawidłowy podpis Webhooka Stripe!");
        }

        if ("checkout.session.completed".equals(event.getType())) {

            Session session;
            try {
                session = (Session) event.getDataObjectDeserializer().deserializeUnsafe();
            } catch (EventDataObjectDeserializationException e) {
                System.err.println("Krytyczny blad deserializacji Stripe: " + e.getMessage());
                return;
            }

            if (session != null) {
                String sessionId = session.getId();
                System.out.println("System rozpoznal sesje z Webhooka: " + sessionId);


                PaymentTransaction transaction;
                try {
                    transaction = transactionRepository.findByStripeSessionId(sessionId)
                            .orElseThrow(() -> new RuntimeException("Nie znaleziono transakcji o ID: " + sessionId));
                } catch (Exception e) {
                    System.err.println("Błąd pobierania z bazy: " + e.getMessage());
                    return;
                }


                try {
                    transaction.setStatus(PaymentStatus.PAID);
                    transactionRepository.saveAndFlush(transaction);
                    System.out.println("SUKCES: Baza danych zaktualizowana na PAID!");
                } catch (Exception e) {
                    System.err.println("Wiadomość: " + e.getMessage());

                }


                String documentUrl = null;
                if (session.getPaymentIntent() != null) {
                    try {
                        PaymentIntent pi = PaymentIntent.retrieve(session.getPaymentIntent());
                        if (pi.getLatestCharge() != null) {
                            Charge charge = Charge.retrieve(pi.getLatestCharge());
                            documentUrl = charge.getReceiptUrl();
                        }
                    } catch (Exception e) {
                        System.err.println("Błąd pobierania pokwitowania ze Stripe: " + e.getMessage());
                    }
                }

                if (session.getCustomerDetails() == null || session.getCustomerDetails().getEmail() == null) {
                    throw new RuntimeException("KRYTYCZNY BŁĄD INTEGRACJI: Stripe nie zwrócił adresu e-mail klienta. Przerwano wysyłkę powiadomienia do RabbitMQ.");
                }
                String customerEmail = session.getCustomerDetails().getEmail();


                PaymentEvent eventMsg = new PaymentEvent(
                        transaction.getOrderId(),
                        customerEmail,
                        PaymentStatus.PAID,
                        transaction.getAmount(),
                        documentUrl
                );

                try {
                    rabbitTemplate.convertAndSend(
                            RabbitMQConfig.EXCHANGE_NAME,
                            RabbitMQConfig.ROUTING_KEY_COMPLETED,
                            eventMsg
                    );
                    System.out.println("Wysłano zdarzenie do RabbitMQ: " + eventMsg);
                } catch (Exception e) {
                    System.err.println("Błąd komunikacji z RabbitMQ: " + e.getMessage());
                }

            } else {
                System.err.println("Blad: Obiekt sesji to null po deserializacji.");
            }
        }
    }
}
