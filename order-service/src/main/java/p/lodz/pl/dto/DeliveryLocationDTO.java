package p.lodz.pl.dto;

import java.math.BigDecimal;

public record DeliveryLocationDTO(
        BigDecimal latitude,
        BigDecimal longitude,
        String addressLine
) {}
