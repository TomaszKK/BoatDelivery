package pl.dmcs.notifiservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pl.dmcs.notifiservice.config.RabbitMQConfig;
import pl.dmcs.notifiservice.dto.OrderEvent;
import pl.dmcs.notifiservice.model.NotificationLog;
import pl.dmcs.notifiservice.model.NotificationStatus;
import pl.dmcs.notifiservice.model.SmsLog;
import pl.dmcs.notifiservice.repository.NotificationLogRepository;
import pl.dmcs.notifiservice.repository.SmsLogRepository;
import pl.dmcs.notifiservice.service.sms.SmsSender;
import pl.dmcs.notifiservice.dto.PaymentEvent;
import pl.dmcs.notifiservice.dto.PaymentStatus;

import java.util.UUID;

@Service
public class EmailNotificationListener {

    private static final String DEFAULT_EMAIL_CONTENT = "Brak wysłanego e-maila";
    private static final String RECIPIENT_LOG_PREFIX = "MAIL ODBIORCY:\n";
    private static final String COURIER_LOG_PREFIX = "MAIL KURIERA:\n";
    private static final String NO_DATA = "BRAK DANYCH";

    public enum EventType {
        ORDER_CREATED,
        IN_TRANSIT_FOR_PACKAGE,
        ORDER_RECEIVED_FROM_CUSTOMER,
        IN_TRANSIT_TO_CUSTOMER,
        DELIVERY_COMPLETED,
        ORDER_CANCELED,
        ROUTE_ASSIGNED_RECEIVE,
        ROUTE_ASSIGNED_DELIVERY
    }

    public enum Audience {
        CUSTOMER,
        RECIPIENT,
        COURIER
    }

    private final EmailSenderService emailSenderService;
    private final NotificationLogRepository emailLogRepository;
    private final SmsLogRepository smsLogRepository;
    private final SseNotificationService sseNotificationService;
    private final SmsSender smsSender;

    public EmailNotificationListener(
            EmailSenderService emailSenderService,
            NotificationLogRepository emailLogRepository,
            SseNotificationService sseNotificationService,
            SmsLogRepository smsLogRepository,
            SmsSender smsSender) {
        this.emailSenderService = emailSenderService;
        this.emailLogRepository = emailLogRepository;
        this.smsLogRepository = smsLogRepository;
        this.sseNotificationService = sseNotificationService;
        this.smsSender = smsSender;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderEvent(OrderEvent event) {
        NotificationStatus status = NotificationStatus.SUCCESS;
        String errorMessage = null;
        String generatedEmailContent = DEFAULT_EMAIL_CONTENT;
        String logRecipientEmail = NO_DATA;

        try {

            EventType currentEvent;
            try {
                currentEvent = EventType.valueOf(event.eventType());
            } catch (IllegalArgumentException e) {
                System.err.println("Otrzymano nieznany typ zdarzenia: " + event.eventType());
                return;
            }
            // Klient wiadmosci
            if (event.targetAudience() != null && event.targetAudience().contains("CUSTOMER")) {
                if(event.customerEmail() != null) logRecipientEmail = event.customerEmail();

                switch (currentEvent) {
                    case ORDER_CREATED -> {
                        generatedEmailContent = emailSenderService.sendOrderCreatedEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Utworzono zlecenie nadania paczki: " + event.trackingNumber());
                    }
                    case IN_TRANSIT_FOR_PACKAGE -> {
                        generatedEmailContent = emailSenderService.sendInTransitForPackageEmail(event.customerEmail(), event.trackingNumber(), event.firstName(), event.pickupAddress(), event.courierPhone());
                        sseNotificationService.pushNotificationToFrontend("Kurier jedzie po odbiór: " + event.trackingNumber());
                    }
                    case ORDER_RECEIVED_FROM_CUSTOMER -> {
                        generatedEmailContent = emailSenderService.sendOrderReceivedEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Kurier odebrał paczkę: " + event.trackingNumber());
                    }
                    case IN_TRANSIT_TO_CUSTOMER -> {
                        generatedEmailContent = emailSenderService.sendInTransitToCustomerEmail(event.customerEmail(), event.trackingNumber(), event.firstName(), event.deliveryAddress(), event.courierPhone());
                        sseNotificationService.pushNotificationToFrontend("Paczka w drodze do doręczenia: " + event.trackingNumber());

//                        String smsMsg = String.format("Dzien dobry, paczke %s doreczy dzis kurier BoadDelivery. Numer telefonu kuriera: %s", event.trackingNumber(), event.courierPhone());
//                        dispatchAndLogSms(event.orderId(), event.trackingNumber(), event.customerPhone(), smsMsg);
                    }
                    case DELIVERY_COMPLETED -> {
                        generatedEmailContent = emailSenderService.sendDeliveryCompletedEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Paczka dostarczona: " + event.trackingNumber());
                    }
                    case ORDER_CANCELED -> {
                        generatedEmailContent = emailSenderService.sendCancellationEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Zlecenie anulowane: " + event.trackingNumber());
                    }

                }
            }

            // Obsługa wiadomości do odbiorcy paczki
            if (event.targetAudience() != null && event.targetAudience().contains(Audience.RECIPIENT.name()) && event.recipientEmail() != null) {

                switch (currentEvent) {
                    case ORDER_CREATED -> {
                        String mailContent = emailSenderService.sendRecipientOrderCreatedEmail(event.recipientEmail(), event.trackingNumber(), event.recipientFirstName(), event.firstName());
                        generatedEmailContent = (generatedEmailContent.equals(DEFAULT_EMAIL_CONTENT) ? "" : generatedEmailContent + "\n---\n") + RECIPIENT_LOG_PREFIX + mailContent;
                    }
                    case IN_TRANSIT_TO_CUSTOMER -> {
                        String mailContent = emailSenderService.sendRecipientInTransitEmail(event.recipientEmail(), event.trackingNumber(), event.recipientFirstName(), event.courierPhone());
                        generatedEmailContent = (generatedEmailContent.equals(DEFAULT_EMAIL_CONTENT) ? "" : generatedEmailContent + "\n---\n") + RECIPIENT_LOG_PREFIX + mailContent;

                        String smsMsg = String.format("Dzien dobry, paczke %s doreczy dzis kurier BoadDelivery. Numer kuriera: %s", event.trackingNumber(), event.courierPhone());
                        dispatchAndLogSms(event.orderId(), event.trackingNumber(), event.recipientPhone(), smsMsg);
                    }
                    case DELIVERY_COMPLETED ->{
                        String mailContent = emailSenderService.sendRecipientOrderDelivered(event.recipientEmail(), event.trackingNumber(), event.recipientFirstName());
                        generatedEmailContent = (generatedEmailContent.equals(DEFAULT_EMAIL_CONTENT) ? "" : generatedEmailContent + "\n---\n") + RECIPIENT_LOG_PREFIX + mailContent;
                    }

                }

                if (logRecipientEmail.equals(NO_DATA)) {
                    logRecipientEmail = event.recipientEmail();
                } else {
                    logRecipientEmail += " ORAZ ODBIORCA: " + event.recipientEmail();
                }
            }

            // Obsługa wiadomości do kuriera
            if (event.targetAudience() != null && event.targetAudience().contains(Audience.COURIER.name())) {
                if (event.courierEmail() != null && !event.targetAudience().contains(Audience.CUSTOMER.name())) {
                    logRecipientEmail = event.courierEmail();
                } else if (event.courierEmail() != null) {
                    logRecipientEmail += " ORAZ " + event.courierEmail();
                }

                switch (currentEvent) {
                    case ROUTE_ASSIGNED_RECEIVE, ROUTE_ASSIGNED_DELIVERY -> {
                        String courierEmailContent = emailSenderService.sendRouteAssignedEmail(event.courierEmail(), event.totalDistanceKm(), event.estimatedDurationMin());
                        generatedEmailContent = (generatedEmailContent.equals(DEFAULT_EMAIL_CONTENT) ? "" : generatedEmailContent + "\n---\n") + COURIER_LOG_PREFIX + courierEmailContent;
                        sseNotificationService.pushNotificationToFrontend(String.format("Nowa trasa przydzielona! Dystans: %.1f km, Czas: %d min.", event.totalDistanceKm(), event.estimatedDurationMin()));
                    }
                    case ORDER_CANCELED -> {
                        String courierEmailContent = emailSenderService.sendCourierCancellationEmail(event.courierEmail(), event.trackingNumber(), event.deliveryAddress());
                        generatedEmailContent = (generatedEmailContent.equals(DEFAULT_EMAIL_CONTENT) ? "" : generatedEmailContent + "\n---\n") + COURIER_LOG_PREFIX + courierEmailContent;
                        sseNotificationService.pushNotificationToFrontend("UWAGA! Anulacja paczki " + event.trackingNumber() + " - zmiana w trasie.");

                        String smsMsg = String.format("Zlecenie %s anulowane! Pomiń adres: %s.", event.trackingNumber(), event.deliveryAddress());
                        dispatchAndLogSms(event.orderId(), event.trackingNumber(), event.courierPhone(), smsMsg);
                    }
                }
            }

        } catch (Exception e) {
            status = NotificationStatus.ERROR;
            errorMessage = e.getMessage();
            System.err.println("Błąd wysyłki powiadomienia: " + errorMessage);
        }

        // Zapis logow emaili
        try {
            NotificationLog dbLog = NotificationLog.builder()
                    .orderId(event.orderId())
                    .recipientEmail(logRecipientEmail)
                    .trackingNumber(event.trackingNumber())
                    .messageContent(generatedEmailContent)
                    .status(status)
                    .errorMessage(errorMessage)
                    .build();

            emailLogRepository.save(dbLog);

        } catch (Exception dbEx) {
            System.err.println("KRYTYCZNY BŁĄD BAZY DANYCH: " + dbEx.getMessage());
        }
    }
    private void dispatchAndLogSms(UUID orderId, String trackNumber, String phone, String message) {
        if (phone == null || phone.isBlank()) {
            System.out.println("Zignorowano wysyłkę SMS - brak numeru telefonu dla zamówienia: " + trackNumber);
            return;
        }

        NotificationStatus smsStatus = NotificationStatus.SUCCESS;
        String smsError = null;

        try {
            smsSender.sendSms(phone, message);
        } catch (Exception e) {
            smsStatus = NotificationStatus.ERROR;
            smsError = e.getMessage();
            System.err.println("Błąd układu SMS: " + smsError);
        } finally {
            try {
                // Zapis logow sms
                SmsLog smsLog = SmsLog.builder()
                        .orderId(orderId)
                        .trackingNumber(trackNumber)
                        .recipientNumber(phone)
                        .messageContent(message)
                        .status(smsStatus)
                        .errorMessage(smsError)
                        .build();

                smsLogRepository.save(smsLog);
            } catch (Exception dbEx) {
                System.err.println("KRYTYCZNY BŁĄD BAZY DANYCH (SMS): " + dbEx.getMessage());
            }
        }
    }
    @RabbitListener(queues = RabbitMQConfig.PAYMENT_QUEUE)
    public void handlePaymentEvent(PaymentEvent event) {
        try {
            if (PaymentStatus.PAID.equals(event.status())) {
                String trackingRef = event.orderId().toString().substring(0, 8);

                String mailContent = emailSenderService.sendInvoiceEmail(
                        event.customerEmail(),
                        trackingRef,
                        event.invoiceUrl()
                );

                sseNotificationService.pushNotificationToFrontend("Płatność zaksięgowana, faktura wysłana.");
                System.out.println("Wysłano fakturę na maila: " + event.customerEmail());

                NotificationLog dbLog = NotificationLog.builder()
                        .orderId(event.orderId())
                        .recipientEmail(event.customerEmail())
                        .trackingNumber(trackingRef)
                        .messageContent("MAIL Z FAKTURĄ:\n" + mailContent)
                        .status(NotificationStatus.SUCCESS)
                        .build();

                emailLogRepository.save(dbLog);
            }
        } catch (Exception e) {
            System.err.println("Błąd wysyłki faktury: " + e.getMessage());

            try {
                NotificationLog errorLog = NotificationLog.builder()
                        .orderId(event.orderId())
                        .recipientEmail(event.customerEmail())
                        .trackingNumber(event.orderId().toString().substring(0, 8))
                        .messageContent("BŁĄD WYSYŁKI FAKTURY")
                        .status(NotificationStatus.ERROR)
                        .errorMessage(e.getMessage())
                        .build();
                emailLogRepository.save(errorLog);
            } catch (Exception dbEx) {
                System.err.println("KRYTYCZNY BŁĄD BAZY DANYCH: " + dbEx.getMessage());
            }
        }
    }
}