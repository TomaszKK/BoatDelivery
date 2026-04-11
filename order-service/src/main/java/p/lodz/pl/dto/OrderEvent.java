package p.lodz.pl.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderEvent(
        String eventType,
        UUID orderId,
        String trackingNumber,
        List<String> targetAudience,
        BigDecimal totalDistanceKm,
        Integer estimatedDurationMin,
        String customerEmail,
        String courierEmail,
        String customerPhone,
        String courierPhone,
        String firstName,
        String lastName,
        String pickupAddress,
        String deliveryAddress
) {}