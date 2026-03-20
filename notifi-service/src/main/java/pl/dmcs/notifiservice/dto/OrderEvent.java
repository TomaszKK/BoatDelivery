package pl.dmcs.notifiservice.dto;

import java.util.UUID;

public record OrderEvent(UUID orderId, String customerEmail, String status) {
}