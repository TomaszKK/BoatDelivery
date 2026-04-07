package p.lodz.pl.dto;

import java.time.Instant;
import java.util.UUID;

public record RouteStopDTO(
        UUID id,
        Integer stopSequence,
        Instant estimatedArrivalTime,
        OrderResponseDTO order
) {
}