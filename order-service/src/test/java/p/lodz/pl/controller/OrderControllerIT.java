package p.lodz.pl.controller;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import p.lodz.pl.dto.LocationRequestDTO;
import p.lodz.pl.dto.LocationResponseDTO;
import p.lodz.pl.dto.OrderRequestDTO;

import java.math.BigDecimal;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class OrderControllerIT {

    private static final UUID EXISTING_ORDER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final String EXISTING_TRACKING_NUMBER = "BD-TEST-0001"; // Założyłem, że taki ustawiłeś w import.sql
    private static final UUID NON_EXISTING_ORDER_ID = UUID.fromString("99999999-9999-9999-9999-999999999999");
    private static final UUID TEST_CUSTOMER_ID = UUID.fromString("c9999999-9999-9999-9999-999999999999");

    @Test
    @DisplayName("GET /api/orders - Should return a list of all orders (200 OK)")
    public void shouldReturnAllOrders() {
        given()
                .when()
                .get("/api/orders")
                .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("size()", org.hamcrest.Matchers.greaterThan(0));
    }

    @Test
    @DisplayName("GET /api/orders/{id} - Should return specific order by ID (200 OK)")
    public void shouldReturnOrderById() {
        given()
                .pathParam("id", EXISTING_ORDER_ID)
                .when()
                .get("/api/orders/{id}")
                .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("trackingNumber", equalTo(EXISTING_TRACKING_NUMBER))
                .body("status", equalTo("ORDER_CREATED"));
    }

    @Test
    @DisplayName("GET /api/orders/{id} - Should return 404 Not Found for non-existing order")
    public void shouldReturn404ForNonExistingOrder() {
        given()
                .pathParam("id", NON_EXISTING_ORDER_ID)
                .when()
                .get("/api/orders/{id}")
                .then()
                .statusCode(404)
                .body("error", equalTo("Not Found"))
                .body("status", equalTo(404));
    }

    @Test
    @DisplayName("POST /api/orders - Should successfully create a new order with 2 locations (201 Created)")
    public void shouldCreateNewOrder() {
        LocationRequestDTO pickup = new LocationRequestDTO(
                "Wólczańska 215", "90-924", "Łódź", "Polska"
        );
        LocationRequestDTO delivery = new LocationRequestDTO(
                "Drewnowska 58", "91-002", "Łódź", "Polska"
        );

        OrderRequestDTO requestDTO = new OrderRequestDTO(
                TEST_CUSTOMER_ID,
                new BigDecimal("12.5"),
                new BigDecimal("2.0"),
                pickup,
                delivery
        );

        given()
                .contentType(ContentType.JSON)
                .body(requestDTO)
                .when()
                .post("/api/orders")
                .then()
                .statusCode(201)
                .body("trackingNumber", notNullValue())
                .body("trackingNumber", startsWith("BD-"))
                .body("status", equalTo("ORDER_CREATED"))
                .body("weight", equalTo(12.5F))
                .body("pickupLocation.streetAddress", equalTo("Wólczańska 215"))
                .body("deliveryLocation.streetAddress", equalTo("Drewnowska 58"));
    }

    @Test
    @DisplayName("PUT /api/orders/{id} - Should successfully update an existing order and its locations (200 OK)")
    public void shouldUpdateOrder() {
        LocationRequestDTO updatedPickup = new LocationRequestDTO(
                "Updated Pickup", "11-111", "Łódź",  "Polska"
        );
        LocationRequestDTO updatedDelivery = new LocationRequestDTO(
                "Updated Delivery", "22-222", "Łódź",  "Polska"
        );

        OrderRequestDTO updateRequest = new OrderRequestDTO(
                TEST_CUSTOMER_ID,
                new BigDecimal("99.9"),
                new BigDecimal("10.0"),
                updatedPickup,
                updatedDelivery
        );

        given()
                .pathParam("id", EXISTING_ORDER_ID)
                .contentType(ContentType.JSON)
                .body(updateRequest)
                .when()
                .put("/api/orders/{id}")
                .then()
                .statusCode(200)
                .body("trackingNumber", equalTo(EXISTING_TRACKING_NUMBER))
                .body("weight", equalTo(99.9F))
                .body("pickupLocation.streetAddress", equalTo("Updated Pickup"))
                .body("deliveryLocation.streetAddress", equalTo("Updated Delivery"));
    }

    @Test
    @DisplayName("PATCH /{id}/status - Should update status of an order (200 OK)")
    public void shouldChangeOrderStatus() {
        given()
                .pathParam("id", EXISTING_ORDER_ID)
                .queryParam("newStatus", "ORDER_RECEIVED_FROM_CUSTOMER")
                .when()
                .patch("/api/orders/{id}/status")
                .then()
                .statusCode(200)
                .body("trackingNumber", equalTo(EXISTING_TRACKING_NUMBER))
                .body("status", equalTo("ORDER_RECEIVED_FROM_CUSTOMER"));
    }

    @Test
    @DisplayName("PATCH /{id}/status - Should return 400 Bad Request when newStatus is missing")
    public void shouldReturn400WhenNewStatusMissing() {
        given()
                .pathParam("id", EXISTING_ORDER_ID)
                .when()
                .patch("/api/orders/{id}/status")
                .then()
                .statusCode(400)
                .body("error", equalTo("Bad Request"))
                .body("message", containsString("Order status cannot be null")); // Upewnij się, że tak jest sformułowany ExceptionMapper
    }

    @Test
    @DisplayName("DELETE /api/orders/{id} - Should successfully delete an order (204 No Content)")
    public void shouldDeleteOrder() {
        UUID orderIdToDelete = UUID.fromString("33333333-3333-3333-3333-333333333333");

        given()
                .pathParam("id", orderIdToDelete)
                .when()
                .delete("/api/orders/{id}")
                .then()
                .statusCode(204);

        given()
                .pathParam("id", orderIdToDelete)
                .when()
                .get("/api/orders/{id}")
                .then()
                .statusCode(404);
    }

    @Test
    @DisplayName("DELETE /api/orders/{id} - Should return 404 when deleting non-existing order")
    public void shouldReturn404WhenDeletingNonExistingOrder() {
        given()
                .pathParam("id", NON_EXISTING_ORDER_ID)
                .when()
                .delete("/api/orders/{id}")
                .then()
                .statusCode(404)
                .body("error", equalTo("Not Found"));
    }
}