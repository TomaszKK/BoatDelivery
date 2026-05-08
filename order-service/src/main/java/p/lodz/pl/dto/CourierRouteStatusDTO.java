package p.lodz.pl.dto;

import java.util.UUID;

public record CourierRouteStatusDTO(
        UUID courierId,
        boolean hasRoute
) {
}

