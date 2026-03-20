package pl.dmcs.notifiservice.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import pl.dmcs.notifiservice.config.RabbitMQConfig;
import pl.dmcs.notifiservice.dto.OrderEvent;
import pl.dmcs.notifiservice.model.NotificationLog;
import pl.dmcs.notifiservice.repository.NotificationLogRepository;

@Service
public class EmailNotificationListener {

    private final EmailSenderService emailSenderService;
    private final NotificationLogRepository logRepository;

    public EmailNotificationListener(
            EmailSenderService emailSenderService,
            NotificationLogRepository logRepository,
        this.emailSenderService = emailSenderService;
        this.logRepository = logRepository;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderCreatedEvent(OrderEvent event) {
        String errorMessage = null;

        try {
            emailSenderService.sendOrderConfirmation(
                    event.customerEmail(),
            );


        } catch (Exception e) {
            errorMessage = e.getMessage();
        } finally {
            logRepository.save(dbLog);
        }
    }
}