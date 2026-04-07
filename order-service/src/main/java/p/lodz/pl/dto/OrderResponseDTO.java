package p.lodz.pl.dto;

import p.lodz.pl.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderResponseDTO(
        String trackingNumber,
        UUID customerId,
        OrderStatus status,
        BigDecimal weight,
        BigDecimal volume,
        Instant createdAt,
        LocationResponseDTO pickupLocation,
        LocationResponseDTO deliveryLocation
) {}