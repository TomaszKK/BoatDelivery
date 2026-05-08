package p.lodz.pl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import p.lodz.pl.ai.DeliveryAssistant;
import p.lodz.pl.dto.OrderMinimalizedResponseDTO;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.service.OrderService;

import java.util.Map;

@Path("/api/orders/ai")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AiController {

    @Inject
    DeliveryAssistant deliveryAssistant;

    @Inject
    OrderService orderService;

    @Inject
    ObjectMapper objectMapper;

    @POST
    @Path("/track/{trackingNumber}")
    @PermitAll
    public Response chatAboutOrder(@PathParam("trackingNumber") String trackingNumber, Map<String, String> request) {
        try {
            String userMessage = request.getOrDefault("message", "What is the status of my order?");

            OrderMinimalizedResponseDTO order = orderService.getOrderByTrackingNumberMinimalized(trackingNumber);
            String orderJson = objectMapper.writeValueAsString(order);

            String aiResponse = deliveryAssistant.trackOrder(userMessage, orderJson);

            return Response.ok(Map.of("response", aiResponse)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", "AI Error"))
                    .build();
        }
    }

    @POST
    @Path("/extract")
    @RolesAllowed("CUSTOMER")
    public Response extractOrderData(Map<String, String> request) {
        String text = request.get("text");
        if (text == null || text.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("error", "There is no text to analyze")).build();
        }

        OrderRequestDTO extractedDto = deliveryAssistant.extractOrderData(text);
        return Response.ok(extractedDto).build();
    }
}