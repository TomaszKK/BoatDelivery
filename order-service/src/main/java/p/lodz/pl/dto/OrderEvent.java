package p.lodz.pl.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderEvent(
        String eventType,
        UUID orderId,
        String trackingNumber,
        List<String> targetAudience,
        java.math.BigDecimal totalDistanceKm,
        Integer estimatedDurationMin,
        String customerEmail,
        String courierEmail,
        String recipientEmail,
        String customerPhone,
        String courierPhone,
        String recipientPhone,
        String firstName,
        String lastName,
        String recipientFirstName,
        String recipientLastName,
        String pickupAddress,
        String deliveryAddress
) {}