package pl.dmcs.notifiservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SmsLogDTO(
        UUID id,
        String trackingNumber,
        String recipientNumber,
        String status,
        String messageContent,
        String errorMessage,
        LocalDateTime createdAt
) {}