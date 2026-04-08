package p.lodz.pl.dto;

import p.lodz.pl.model.enums.RouteStatus;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record RouteResponseDTO(
        UUID id,
        UUID courierId,
        RouteStatus status,
        BigDecimal totalDistanceKm,
        Integer estimatedDurationMin,
        List<RouteStopDTO> stops
) {
}