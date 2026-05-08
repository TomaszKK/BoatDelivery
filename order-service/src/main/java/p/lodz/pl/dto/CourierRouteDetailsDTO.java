package p.lodz.pl.dto;

public record CourierRouteDetailsDTO(
        boolean hasRoute,
        RouteResponseDTO route,
        TransportDTO transport
) {
}

