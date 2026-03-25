package pl.dmcs.paymentservice.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dmcs.paymentservice.dto.PaymentRequest;
import pl.dmcs.paymentservice.model.PaymentStatus;
import pl.dmcs.paymentservice.model.PaymentTransaction;
import pl.dmcs.paymentservice.repository.PaymentTransactionRepository;
import com.stripe.exception.EventDataObjectDeserializationException;

import java.math.BigDecimal;

@Service
public class PaymentService {

    private final PaymentTransactionRepository transactionRepository;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    // Przykladowe przekierowanie po oplaeniu udany lub nie
    private static final String FRONTEND_SUCCESS_URL = "http://localhost:3000/payment/success";
    private static final String FRONTEND_CANCEL_URL = "http://localhost:3000/payment/cancel";
    private final org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate;

    public PaymentService(PaymentTransactionRepository transactionRepository, org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate) {
        this.transactionRepository = transactionRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public String createPaymentSession(PaymentRequest request) throws StripeException {
        if (transactionRepository.findByOrderId(request.orderId()).isPresent()) {
            throw new IllegalStateException("Transakcja dla tego zamówienia już istnieje!");
        }

        // Stripe przyjmuje kwoty w groszach
        long amountInCents = request.amount().multiply(new BigDecimal("100")).longValue();

        // Stripe checkoout
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(FRONTEND_SUCCESS_URL)
                .setCancelUrl(FRONTEND_CANCEL_URL)
                .setCustomerEmail(request.customerEmail())
                .putMetadata("order_id", request.orderId().toString())
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

        // Zapisanie transakcji ze statusem PENDING do bazy danych
        PaymentTransaction transaction = PaymentTransaction.builder()
                .orderId(request.orderId())
                .stripeSessionId(session.getId())
                .amount(request.amount())
                .currency("PLN")
                .status(PaymentStatus.PENDING)
                .build();

        transactionRepository.save(transaction);

        // Adres URL platnosci
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
                // Zabezpieczona proba wymuszenia parsowania
                session = (Session) event.getDataObjectDeserializer().deserializeUnsafe();
            } catch (EventDataObjectDeserializationException e) {
                System.err.println("Krytyczny blad deserializacji Stripe: " + e.getMessage());
                return;
            }

            if (session != null) {
                String sessionId = session.getId();
                System.out.println("System rozpoznal sesje z Webhooka: " + sessionId);

                // Szukamy transakcji w naszej bazie
                PaymentTransaction transaction = transactionRepository.findByStripeSessionId(sessionId)
                        .orElseThrow(() -> new RuntimeException("Nie znaleziono transakcji o ID: " + sessionId));

                // Aktualizacja statusu na oplacony
                transaction.setStatus(PaymentStatus.COMPLETED);
                transactionRepository.save(transaction);

                System.out.println("=========================================");
                System.out.println("PLATNOSC ZAKSIEGOWANA!");
                System.out.println("Zamowienie: " + transaction.getOrderId());
                System.out.println("Kwota: " + transaction.getAmount() + " PLN");
                System.out.println("=========================================");

                pl.dmcs.paymentservice.dto.PaymentEvent eventMsg =
                        new pl.dmcs.paymentservice.dto.PaymentEvent(transaction.getOrderId(), "PAID", transaction.getAmount());

                rabbitTemplate.convertAndSend(
                        pl.dmcs.paymentservice.config.RabbitMQConfig.EXCHANGE_NAME,
                        pl.dmcs.paymentservice.config.RabbitMQConfig.ROUTING_KEY_COMPLETED,
                        eventMsg
                );

                System.out.println("Wyslano zdarzenie do RabbitMQ: " + eventMsg);

            } else {
                System.err.println("Blad: Obiekt sesji to null po deserializacji.");
            }
        } else {
            System.out.println("Zignorowano zdarzenie Stripe typu: " + event.getType());
        }
    }
}