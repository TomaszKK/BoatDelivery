package pl.dmcs.notifiservice.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentEvent(
        UUID orderId,
        String customerEmail,
        PaymentStatus status,
        BigDecimal amount,
        String invoiceUrl
) {}
