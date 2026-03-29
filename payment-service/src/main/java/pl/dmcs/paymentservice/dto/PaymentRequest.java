package pl.dmcs.paymentservice.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentRequest(
        UUID orderId,
        BigDecimal amount,
        String customerEmail
) {}