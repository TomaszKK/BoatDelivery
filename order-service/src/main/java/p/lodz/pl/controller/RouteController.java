package p.lodz.pl.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import p.lodz.pl.service.RouteService;

import java.util.UUID;

@Path("/api/orders/routes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RouteController {

    @Inject
    RouteService routeService;

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed({"ADMIN", "COURIER"})
    public Response getAllRoutes() {
        String userId = jwt.getSubject();
        boolean isAdmin = jwt.getGroups() != null && jwt.getGroups().contains("ADMIN");

        return Response.ok(routeService.getAllRoutes(userId, isAdmin)).build();
    }

    @POST
    @Path("/{id}/start")
    @RolesAllowed({"COURIER"})
    public Response startRoute(@PathParam("id") UUID routeId) {
        try {
            String userId = jwt.getSubject();
            routeService.startRoute(routeId, userId);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/stops/{id}/complete")
    @RolesAllowed({"COURIER"})
    public Response completeStop(@PathParam("id") UUID stopId) {
        try {
            String userId = jwt.getSubject();
            routeService.markStopAsCompleted(stopId, userId);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/{id}/finish")
    @RolesAllowed({"COURIER"})
    public Response finishRoute(@PathParam("id") UUID routeId) {
        try {
            String userId = jwt.getSubject();
            routeService.finishRoute(routeId, userId);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        }
    }
}