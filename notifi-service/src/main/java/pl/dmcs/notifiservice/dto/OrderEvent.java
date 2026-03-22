package pl.dmcs.notifiservice.dto;

import pl.dmcs.notifiservice.model.NotificationStatus;

import java.util.UUID;

public record OrderEvent(UUID orderId, String customerEmail, NotificationStatus status) {
}
