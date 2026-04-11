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

import java.util.UUID;

@Service
public class EmailNotificationListener {

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
        String generatedEmailContent = "Brak wysłanego e-maila";
        String logRecipientEmail = "BRAK DANYCH";

        try {
            // Obsluga wiadomosci do klineta
            if (event.targetAudience() != null && event.targetAudience().contains("CUSTOMER")) {
                if(event.customerEmail() != null) logRecipientEmail = event.customerEmail();

                switch (event.eventType()) {
                    case "ORDER_CREATED" -> {
                        generatedEmailContent = emailSenderService.sendOrderCreatedEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Utworzono zlecenie nadania paczki: " + event.trackingNumber());
                    }
                    case "IN_TRANSIT_FOR_PACKAGE" -> {
                        generatedEmailContent = emailSenderService.sendInTransitForPackageEmail(event.customerEmail(), event.trackingNumber(), event.firstName(), event.pickupAddress(), event.courierPhone());
                        sseNotificationService.pushNotificationToFrontend("Kurier jedzie po odbiór: " + event.trackingNumber());
                    }
                    case "ORDER_RECEIVED_FROM_CUSTOMER" -> {
                        generatedEmailContent = emailSenderService.sendOrderReceivedEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Kurier odebrał paczkę: " + event.trackingNumber());
                    }
                    case "IN_TRANSIT_TO_CUSTOMER" -> {
                        generatedEmailContent = emailSenderService.sendInTransitToCustomerEmail(event.customerEmail(), event.trackingNumber(), event.firstName(), event.deliveryAddress(), event.courierPhone());
                        sseNotificationService.pushNotificationToFrontend("Paczka w drodze do doręczenia: " + event.trackingNumber());

                        String smsMsg = String.format("Dzien dobry, paczke %s doreczy dzis kurier BoadDelivery. Numer telefonu kuriera: %s", event.trackingNumber(), event.courierPhone());
                        dispatchAndLogSms(event.orderId(), event.trackingNumber(), event.customerPhone(), smsMsg);
                    }
                    case "DELIVERY_COMPLETED" -> {
                        generatedEmailContent = emailSenderService.sendDeliveryCompletedEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Paczka dostarczona: " + event.trackingNumber());
                    }
                    case "ORDER_CANCELED" -> {
                        generatedEmailContent = emailSenderService.sendCancellationEmail(event.customerEmail(), event.trackingNumber(), event.firstName());
                        sseNotificationService.pushNotificationToFrontend("Zlecenie anulowane: " + event.trackingNumber());
                    }
                }
            }

            // Obsługa wiadomości do odbiorcy paczki
            if (event.targetAudience() != null && event.targetAudience().contains("RECIPIENT") && event.recipientEmail() != null) {

                String recipientLogContext = "MAIL ODBIORCY:\n";

                switch (event.eventType()) {
                    case "ORDER_CREATED" -> {
                        String mailContent = emailSenderService.sendRecipientOrderCreatedEmail(event.recipientEmail(), event.trackingNumber(), event.recipientFirstName(), event.firstName());
                        generatedEmailContent = (generatedEmailContent.equals("Brak wysłanego e-maila") ? "" : generatedEmailContent + "\n---\n") + recipientLogContext + mailContent;
                    }
                    case "IN_TRANSIT_TO_CUSTOMER" -> {
                        String mailContent = emailSenderService.sendRecipientInTransitEmail(event.recipientEmail(), event.trackingNumber(), event.recipientFirstName(), event.courierPhone());
                        generatedEmailContent = (generatedEmailContent.equals("Brak wysłanego e-maila") ? "" : generatedEmailContent + "\n---\n") + recipientLogContext + mailContent;

                        String smsMsg = String.format("Dzien dobry, paczke %s doreczy dzis kurier BoadDelivery. Numer kuriera: %s", event.trackingNumber(), event.courierPhone());
                        dispatchAndLogSms(event.orderId(), event.trackingNumber(), event.recipientPhone(), smsMsg);
                    }
                }

                // Dopisujemy odbiorcę do logów bazy danych
                if (logRecipientEmail.equals("BRAK DANYCH")) {
                    logRecipientEmail = event.recipientEmail();
                } else {
                    logRecipientEmail += " ORAZ ODBIORCA: " + event.recipientEmail();
                }
            }


            // Obsluga wiadomosci do kuriera
            if (event.targetAudience() != null && event.targetAudience().contains("COURIER")) {
                if(event.courierEmail() != null && !event.targetAudience().contains("CUSTOMER")) {
                    logRecipientEmail = event.courierEmail();
                } else if (event.courierEmail() != null) {
                    logRecipientEmail += " ORAZ " + event.courierEmail();
                }

                switch (event.eventType()) {
                    case "ROUTE_ASSIGNED_RECEIVE", "ROUTE_ASSIGNED_DELIVERY" -> {
                        String courierEmailContent = emailSenderService.sendRouteAssignedEmail(event.courierEmail(), event.totalDistanceKm(), event.estimatedDurationMin());
                        generatedEmailContent = (generatedEmailContent.equals("Brak wysłanego e-maila") ? "" : generatedEmailContent + "\n---\n") + "MAIL KURIERA:\n" + courierEmailContent;
                        sseNotificationService.pushNotificationToFrontend(String.format("Nowa trasa przydzielona! Dystans: %.1f km, Czas: %d min.", event.totalDistanceKm(), event.estimatedDurationMin()));
                    }
                    case "ORDER_CANCELED" -> {

                        String courierEmailContent = emailSenderService.sendCourierCancellationEmail(event.courierEmail(), event.trackingNumber(), event.deliveryAddress());
                        generatedEmailContent = (generatedEmailContent.equals("Brak wysłanego e-maila") ? "" : generatedEmailContent + "\n---\n") + "MAIL KURIERA:\n" + courierEmailContent;
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
}