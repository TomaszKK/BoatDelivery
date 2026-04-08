package p.lodz.pl.dto;

import java.math.BigDecimal;

public record LocationResponseDTO(
        BigDecimal latitude,
        BigDecimal longitude,
        String streetAddress,
        String postalCode,
        String city,
        String country
) {}