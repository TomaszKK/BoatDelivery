package p.lodz.pl.controller;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import p.lodz.pl.dto.LocationDTO;
import p.lodz.pl.dto.OrderRequestDTO;

import java.math.BigDecimal;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.*;

@QuarkusTest
public class OrderControllerIT {

    private static final UUID EXISTING_ORDER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
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
                .body("id", equalTo(EXISTING_ORDER_ID.toString()))
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
        LocationDTO pickup = new LocationDTO(
                new BigDecimal("51.75"),
                new BigDecimal("19.45"),
                "Wólczańska 215", "90-924", "Łódź"
        );
        LocationDTO delivery = new LocationDTO(
                new BigDecimal("51.77"),
                new BigDecimal("19.44"),
                "Drewnowska 58", "91-002", "Łódź"
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
                .body("id", notNullValue())
                .body("status", equalTo("ORDER_CREATED"))
                .body("weight", equalTo(12.5F))
                .body("pickupLocation.streetAddress", equalTo("Wólczańska 215"))
                .body("deliveryLocation.streetAddress", equalTo("Drewnowska 58"));
    }

    @Test
    @DisplayName("PUT /api/orders/{id} - Should successfully update an existing order and its locations (200 OK)")
    public void shouldUpdateOrder() {
        LocationDTO updatedPickup = new LocationDTO(
                new BigDecimal("51.747123"),
                new BigDecimal("19.453987"),
                "Updated Pickup", "11-111", "Łódź"
        );
        LocationDTO updatedDelivery = new LocationDTO(
                new BigDecimal("51.760000"),
                new BigDecimal("19.460000"),
                "Updated Delivery", "22-222", "Łódź"
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
                .body("id", equalTo(EXISTING_ORDER_ID.toString()))
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
                .body("id", equalTo(EXISTING_ORDER_ID.toString()))
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
                .body("message", containsString("Order status cannot be null"));
    }

    @Test
    @DisplayName("DELETE /api/orders/{id} - Should successfully delete an order (204 No Content)")
    public void shouldDeleteOrder() {
        LocationDTO tempLocation = new LocationDTO(
                new BigDecimal("51.0"),
                new BigDecimal("20.0"),
                "To be deleted", "00-000", "City"
        );

        OrderRequestDTO tempRequest = new OrderRequestDTO(
                TEST_CUSTOMER_ID,
                BigDecimal.ONE,
                BigDecimal.ONE,
                tempLocation,
                tempLocation
        );

        String tempOrderId = given()
                .contentType(ContentType.JSON)
                .body(tempRequest)
                .when()
                .post("/api/orders")
                .then()
                .statusCode(201)
                .extract().path("id");

        given()
                .pathParam("id", tempOrderId)
                .when()
                .delete("/api/orders/{id}")
                .then()
                .statusCode(204);

        given()
                .pathParam("id", tempOrderId)
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