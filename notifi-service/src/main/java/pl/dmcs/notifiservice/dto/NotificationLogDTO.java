package pl.dmcs.notifiservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationLogDTO(
        UUID id,
        String trackingNumber,
        String recipientEmail,
        String status,
        String messageContent,
        String errorMessage,
        LocalDateTime createdAt
) {}