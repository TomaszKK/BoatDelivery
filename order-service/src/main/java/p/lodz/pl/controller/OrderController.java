package p.lodz.pl.controller;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.service.OrderService;

import java.util.UUID;

@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrderController {

    @Inject
    OrderService orderService;

    @POST
    public Response createOrder(OrderRequestDTO requestDTO) {
        return Response.status(Response.Status.CREATED)
                .entity(orderService.createOrder(requestDTO))
                .build();
    }

    @GET
    public Response getAllOrders() {
        return Response.ok(orderService.getAllOrders()).build();
    }

    @GET
    @Path("/{id}")
    public Response getOrderById(@PathParam("id") UUID id) {
        return Response.ok(orderService.getOrderById(id)).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateOrder(@PathParam("id") UUID id, OrderRequestDTO requestDTO) {
        return Response.ok(orderService.updateOrder(id, requestDTO)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteOrder(@PathParam("id") UUID id) {
        orderService.deleteOrder(id);
        return Response.noContent().build();
    }
}