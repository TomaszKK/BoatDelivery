package pl.dmcs.notifiservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pl.dmcs.notifiservice.config.RabbitMQConfig;
import pl.dmcs.notifiservice.dto.OrderEvent;
import pl.dmcs.notifiservice.model.NotificationLog;
import pl.dmcs.notifiservice.repository.NotificationLogRepository;
import pl.dmcs.notifiservice.controller.NotificationController; // Dodany import

@Service
public class EmailNotificationListener {

    private final EmailSenderService emailSenderService;
    private final NotificationLogRepository logRepository;
    private final NotificationController notificationController;

    public EmailNotificationListener(
            EmailSenderService emailSenderService,
            NotificationLogRepository logRepository,
            NotificationController notificationController) {
        this.emailSenderService = emailSenderService;
        this.logRepository = logRepository;
        this.notificationController = notificationController;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderCreatedEvent(OrderEvent event) {
        String status = "SUCCESS";
        String errorMessage = null;

        try {
            emailSenderService.sendOrderConfirmation(
                    event.customerEmail(),
                    event.orderId(),
                    event.status()
            );

            String frontendMessage = "Nowe zamówienie: " + event.orderId() + " (" + event.status() + ")";
            notificationController.pushNotificationToFrontend(frontendMessage);

        } catch (Exception e) {
            status = "ERROR";
            errorMessage = e.getMessage();
            System.err.println("Błąd układu wykonawczego dla zamówienia " + event.orderId() + ": " + errorMessage);
        } finally {
            // Zapis logow wysylkowych do bazy danych
            NotificationLog dbLog = new NotificationLog(
                    event.orderId(),
                    event.customerEmail(),
                    status,
                    errorMessage
            );
            logRepository.save(dbLog);
        }
    }
}