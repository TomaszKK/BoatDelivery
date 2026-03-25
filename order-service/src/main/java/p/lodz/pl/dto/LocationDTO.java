package p.lodz.pl.dto;

import java.math.BigDecimal;

public record LocationDTO(
        BigDecimal latitude,
        BigDecimal longitude,
        String streetAddress,
        String postalCode,
        String city
) {}