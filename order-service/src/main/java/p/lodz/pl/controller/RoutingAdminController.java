package p.lodz.pl.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.service.AlgorithmSettingsService;
import p.lodz.pl.service.DailyRouteScheduler;

@Path("/api/admin/routing")
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
        return Response.ok().build();
    }

    @POST
    @Path("/settings/algorithm")
    public Response setAlgorithm(@QueryParam("type") AlgorithmType type) {
        if (type == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("You have to enter type parameter").build();
        }
        settingsService.setCurrentAlgorithm(type);
        return Response.ok().build();
    }

    @POST
    @Path("/force-optimize")
    public Response forceOptimization() {
            dailyRouteScheduler.forceImmediateOptimization();
            return Response.ok().build();
    }
}