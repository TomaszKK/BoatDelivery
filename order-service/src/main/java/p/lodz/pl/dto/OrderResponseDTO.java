package p.lodz.pl.dto;

import p.lodz.pl.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderResponseDTO(
        UUID id, // Do platnosci
        String trackingNumber,
        UUID customerId,
        OrderStatus status,
        BigDecimal weight,
        BigDecimal volume,
        Instant createdAt,
        String recipientFirstName,
        String recipientLastName,
        String recipientEmail,
        String recipientPhone,
        LocationResponseDTO pickupLocation,
        LocationResponseDTO deliveryLocation
) {}