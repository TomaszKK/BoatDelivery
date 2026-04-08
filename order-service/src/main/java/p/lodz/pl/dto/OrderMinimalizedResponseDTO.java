package p.lodz.pl.dto;

import p.lodz.pl.model.enums.OrderStatus;

import java.math.BigDecimal;

public record OrderMinimalizedResponseDTO(
        String trackingNumber,
        OrderStatus status,
        BigDecimal weight
) {
}