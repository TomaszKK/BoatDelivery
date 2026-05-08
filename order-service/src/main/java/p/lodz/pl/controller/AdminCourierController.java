package p.lodz.pl.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import p.lodz.pl.client.UserServiceClient;
import p.lodz.pl.dto.CourierRouteDetailsDTO;
import p.lodz.pl.dto.CourierRouteStatusDTO;
import p.lodz.pl.dto.RouteResponseDTO;
import p.lodz.pl.dto.UserDTO;
import p.lodz.pl.mapper.RouteMapper;
import p.lodz.pl.model.Route;
import p.lodz.pl.repository.RouteRepository;
import p.lodz.pl.service.RouteService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Path("/api/orders/admin/couriers")
@RolesAllowed("ADMIN")
@Produces(MediaType.APPLICATION_JSON)
public class AdminCourierController {

    @Inject
    RouteService routeService;

    @Inject
    RouteMapper routeMapper;

    @Inject
    RouteRepository routeRepository;

    @Inject
    @RestClient
    UserServiceClient userServiceClient;

    @GET
    @Path("/routes-status")
    public Response getRoutesStatus() {
        Map<UUID, Boolean> hasRouteMap = new HashMap<>();
        routeRepository.listAll().forEach(route -> {
            if (route.courierId != null) {
                hasRouteMap.put(route.courierId, true);
            }
        });

        List<CourierRouteStatusDTO> result = hasRouteMap.entrySet().stream()
                .map(entry -> new CourierRouteStatusDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());

        return Response.ok(result).build();
    }

    @GET
    @Path("/{courierId}/route-details")
    public Response getRouteDetails(@PathParam("courierId") UUID courierId) {
        Route route = routeService.getPreferredRouteForCourier(courierId);
        RouteResponseDTO routeDto = route != null ? routeMapper.toDto(route) : null;

        UserDTO courier = userServiceClient.getCourierById(courierId);

        CourierRouteDetailsDTO response = new CourierRouteDetailsDTO(
                routeDto != null,
                routeDto,
                courier != null ? courier.transport() : null
        );
        return Response.ok(response).build();
    }
}
