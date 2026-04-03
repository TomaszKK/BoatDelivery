package p.lodz.pl.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.service.AlgorithmSettingsService;
import p.lodz.pl.service.DailyRouteScheduler;

import java.util.concurrent.ExecutionException;

@Path("/api/orders/admin/routing")
@RolesAllowed("ADMIN")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RoutingAdminController {

    @Inject
    AlgorithmSettingsService settingsService;

    @Inject
    DailyRouteScheduler dailyRouteScheduler;

    @GET
    @Path("/settings/algorithm")
    public Response getCurrentAlgorithm() {
        return Response.ok("{\"currentAlgorithm\": \"" + settingsService.getCurrentAlgorithm() + "\"}").build();
    }

    @POST
    @Path("/settings/algorithm")
    public Response setAlgorithm(@QueryParam("type") AlgorithmType type) {
        if (type == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("You have to enter type parameter").build();
        }
        settingsService.setCurrentAlgorithm(type);
        return Response.ok("{\"message\": \"Algorithm found: " + type + "\"}").build();
    }

    @POST
    @Path("/force-optimize")
    public Response forceOptimization() {
        try {
            dailyRouteScheduler.forceImmediateOptimization();
            return Response.ok("{\"message\": \"Wymuszono optymalizację tras\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Błąd serwera podczas układania tras: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}