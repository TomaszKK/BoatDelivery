package p.lodz.pl.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderRequestDTO(
        UUID customerId,
        BigDecimal weight,
        BigDecimal volume,
        LocationDTO pickupLocation,
        LocationDTO deliveryLocation
) {}