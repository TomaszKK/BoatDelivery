package pl.dmcs.notifiservice.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import pl.dmcs.notifiservice.dto.NotificationLogDTO;
import pl.dmcs.notifiservice.dto.SmsLogDTO;
import pl.dmcs.notifiservice.repository.NotificationLogRepository;
import pl.dmcs.notifiservice.repository.SmsLogRepository;
import pl.dmcs.notifiservice.service.SseNotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final SseNotificationService sseService;
    private final NotificationLogRepository emailLogRepository;
    private final SmsLogRepository smsLogRepository;

    public NotificationController(SseNotificationService sseService,
                                  NotificationLogRepository emailLogRepository,
                                  SmsLogRepository smsLogRepository) {
        this.sseService = sseService;
        this.emailLogRepository = emailLogRepository;
        this.smsLogRepository = smsLogRepository;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications() {
        return sseService.createEmitter();
    }

    @GetMapping("/logs/email")
    public ResponseEntity<List<NotificationLogDTO>> getEmailLogs() {
        List<NotificationLogDTO> logs = emailLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(log -> new NotificationLogDTO(
                        log.getId(),
                        log.getTrackingNumber(),
                        log.getRecipientEmail(),
                        log.getStatus().name(),
                        log.getMessageContent(),
                        log.getErrorMessage(),
                        log.getCreatedAt()
                )).toList();

        return ResponseEntity.ok(logs);
    }

    @GetMapping("/logs/sms")
    public ResponseEntity<List<SmsLogDTO>> getSmsLogs() {
        List<SmsLogDTO> logs = smsLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(log -> new SmsLogDTO(
                        log.getId(),
                        log.getTrackingNumber(),
                        log.getRecipientNumber(),
                        log.getStatus().name(),
                        log.getMessageContent(),
                        log.getErrorMessage(),
                        log.getCreatedAt()
                )).toList();

        return ResponseEntity.ok(logs);
    }
}