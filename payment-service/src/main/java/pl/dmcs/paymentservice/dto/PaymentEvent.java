package pl.dmcs.paymentservice.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentEvent(
        UUID orderId,
        String status, // PAID, FAILED
        BigDecimal amount
) {}