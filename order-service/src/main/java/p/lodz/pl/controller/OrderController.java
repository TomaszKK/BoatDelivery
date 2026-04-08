package p.lodz.pl.controller;

import io.quarkus.security.Authenticated;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.jboss.logging.Logger;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.dto.OrderResponseDTO;
import p.lodz.pl.dto.maps.HerePosition;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.service.LocationService;
import p.lodz.pl.service.OrderService;

import java.util.UUID;

@Path("/api/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrderController {

    @Inject
    OrderService orderService;

    @Inject
    LocationService locationService;

    @Inject
    JsonWebToken jwt;

    private static final Logger LOG = Logger.getLogger(OrderController.class);

    @POST
    @RolesAllowed("CUSTOMER")
    public Response createOrder(OrderRequestDTO requestDTO) {
        LOG.infof("Received order creation request: %s", requestDTO);

        HerePosition pickupPos = locationService.getCoordinatesIfValid(
                requestDTO.pickupLocation().streetAddress(),
                requestDTO.pickupLocation().city(),
                requestDTO.pickupLocation().postalCode(),
                requestDTO.pickupLocation().country()
        );

        HerePosition deliveryPos = locationService.getCoordinatesIfValid(
                requestDTO.deliveryLocation().streetAddress(),
                requestDTO.deliveryLocation().city(),
                requestDTO.deliveryLocation().postalCode(),
                requestDTO.deliveryLocation().country()
        );

        if (pickupPos == null || deliveryPos == null) {
            LOG.error("Rejecting request (400 Bad Request) - one or both addresses are invalid.");
            throw new BadRequestException("One or both addresses are invalid. Please check the provided address details.");
        }

        OrderResponseDTO responseDTO = orderService.createOrder(requestDTO, pickupPos, deliveryPos);
        LOG.infof("Successfully created order with tracking number: %s", responseDTO.trackingNumber());

        return Response.status(Response.Status.CREATED).entity(responseDTO).build();
    }

    @GET
    @Path("/{id}")
    @RolesAllowed({"ADMIN", "CUSTOMER", "COURIER"})
    public Response getOrderById(@PathParam("id") UUID id) {
        return Response.ok(orderService.getOrderById(id)).build();
    }

    @GET
    @Path("/tracking/{trackingNumber}")
    @RolesAllowed({"ADMIN", "CUSTOMER", "COURIER"})
    public Response getOrderByTrackingNumber(@PathParam("trackingNumber") String trackingNumber) {
        return Response.ok(orderService.getOrderByTrackingNumber(trackingNumber)).build();
    }

    @GET
    @Path("/tracking/minimalized/{trackingNumber}")
    @PermitAll
    public Response getOrderMinimalized(@PathParam("trackingNumber") String trackingNumber) {
        return Response.ok(orderService.getOrderByTrackingNumberMinimalized(trackingNumber)).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({"ADMIN", "CUSTOMER"})
    public Response updateOrder(@PathParam("id") UUID id, OrderRequestDTO requestDTO) {
        return Response.ok(orderService.updateOrder(id, requestDTO)).build();
    }

    @PATCH
    @Path("/{id}/status")
    @RolesAllowed({"ADMIN", "COURIER", "CUSTOMER"})
    public Response changeOrderStatus(
            @PathParam("id") UUID id,
            @QueryParam("newStatus") OrderStatus newStatus) {

        OrderResponseDTO updatedOrder = orderService.changeOrderStatus(id, newStatus);
        return Response.ok(updatedOrder).build();
    }

    @DELETE
    @Path("/{trackingNumber}")
    @RolesAllowed("ADMIN")
    public Response deleteOrder(@PathParam("trackingNumber") String trackingNumber) {
        orderService.deleteOrder(trackingNumber);
        return Response.noContent().build();
    }

    @GET
    @RolesAllowed("ADMIN")
    public Response getOrders(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size,
            @QueryParam("status") OrderStatus status) {

        return Response.ok(orderService.getOrdersPaged(page, size, status)).build();
    }

    @GET
    @Path("/my")
    @RolesAllowed("CUSTOMER")
    public Response getMyOrders() {
        String userId = jwt.getSubject();
        return Response.ok(orderService.getOrdersByCustomerId(userId)).build();
    }

    @GET
    @Path("/stats")
    @RolesAllowed("ADMIN")
    public Response getStatistics() {
        return Response.ok(orderService.getAdminStatistics()).build();
    }
}