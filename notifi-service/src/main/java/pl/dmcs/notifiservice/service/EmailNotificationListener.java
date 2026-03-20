package pl.dmcs.notifiservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pl.dmcs.notifiservice.config.RabbitMQConfig;
import pl.dmcs.notifiservice.dto.OrderEvent;
import pl.dmcs.notifiservice.model.NotificationLog;
import pl.dmcs.notifiservice.model.NotificationStatus;
import pl.dmcs.notifiservice.repository.NotificationLogRepository;

@Service
public class EmailNotificationListener {

    private final EmailSenderService emailSenderService;
    private final NotificationLogRepository logRepository;
    private final SseNotificationService sseNotificationService;

    public EmailNotificationListener(
            EmailSenderService emailSenderService,
            NotificationLogRepository logRepository,
            SseNotificationService sseNotificationService) {
        this.emailSenderService = emailSenderService;
        this.logRepository = logRepository;
        this.sseNotificationService = sseNotificationService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderCreatedEvent(OrderEvent event) {
        NotificationStatus status = NotificationStatus.SUCCESS;
        String errorMessage = null;

        try {
            emailSenderService.sendOrderConfirmation(
                    event.customerEmail(),
                    event.orderId().toString(),
                    event.status()
            );

            String frontendMessage = "Nowe zamówienie: " + event.orderId().toString() + " (" + event.status() + ")";
            sseNotificationService.pushNotificationToFrontend(frontendMessage);

        } catch (Exception e) {
            status = NotificationStatus.ERROR;
            errorMessage = e.getMessage();
            System.err.println("Błąd układu wykonawczego: " + errorMessage);
        } finally {
            NotificationLog dbLog = NotificationLog.builder()
                    .orderId(event.orderId())
                    .recipientEmail(event.customerEmail())
                    .status(status)
                    .errorMessage(errorMessage)
                    .build();

            logRepository.save(dbLog);
        }
    }
}