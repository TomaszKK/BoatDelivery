package p.lodz.pl.service;

import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import p.lodz.pl.dto.LocationRequestDTO;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.dto.OrderResponseDTO;
import p.lodz.pl.dto.maps.HerePosition;
import p.lodz.pl.exception.BadRequestException;
import p.lodz.pl.exception.ResourceNotFoundException;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@QuarkusTest
public class OrderServiceTest {

    @Inject
    OrderService orderService;

    @Test
    @DisplayName("getOrderById - Should correctly map and return order when it exists in the database")
    public void shouldReturnOrderWhenIdExists() {
        UUID orderId = UUID.randomUUID();
        Order mockOrder = new Order();
        mockOrder.id = orderId;
        mockOrder.trackingNumber = "trackingNumber";
        mockOrder.status = OrderStatus.ORDER_CREATED;
        mockOrder.weight = new BigDecimal("10.5");

        PanacheMock.mock(Order.class);
        Mockito.when(Order.findByIdOptional(orderId)).thenReturn(Optional.of(mockOrder));

        OrderResponseDTO result = orderService.getOrderById(orderId);

        Assertions.assertNotNull(result, "Result should not be null");
        Assertions.assertEquals("trackingNumber", result.trackingNumber(), "Tracking number should match");
        Assertions.assertEquals(OrderStatus.ORDER_CREATED, result.status(), "Status should be ORDER_CREATED");
        Assertions.assertEquals(new BigDecimal("10.5"), result.weight(), "Weight should match");
    }

    @Test
    @DisplayName("getOrderById - Should throw ResourceNotFoundException when order does not exist")
    public void shouldThrowExceptionWhenOrderNotFound() {
        UUID fakeId = UUID.randomUUID();
        PanacheMock.mock(Order.class);
        Mockito.when(Order.findByIdOptional(fakeId)).thenReturn(Optional.empty());

        ResourceNotFoundException thrownException = Assertions.assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.getOrderById(fakeId)
        );

        String message = thrownException.getMessage().toLowerCase();

        Assertions.assertTrue(message.contains(fakeId.toString()), "Message should contain the missing ID");
        Assertions.assertTrue(message.contains("not found"), "Message should explain that resource is missing");
    }

    @Test
    @DisplayName("createOrder - Should force status to ORDER_CREATED and persist successfully")
    public void shouldCreateOrderAndSetDefaultStatus() {
        LocationRequestDTO pickup = new LocationRequestDTO("Wólczańska 215", "90-924", "Łódź", "Polska");
        LocationRequestDTO delivery = new LocationRequestDTO("Drewnowska 58", "91-002", "Łódź", "Polska");
        HerePosition pickupPos = new HerePosition(BigDecimal.valueOf(51.7592), BigDecimal.valueOf(19.4559));
        HerePosition deliveryPos = new HerePosition(BigDecimal.valueOf(52.2297), BigDecimal.valueOf(21.0122));

        OrderRequestDTO request = new OrderRequestDTO(
                UUID.randomUUID(),
                new BigDecimal("5.0"),
                new BigDecimal("1.0"),
                pickup,
                delivery
        );

        OrderResponseDTO response = orderService.createOrder(request, pickupPos, deliveryPos);

        Assertions.assertNotNull(response);
        Assertions.assertEquals(OrderStatus.ORDER_CREATED, response.status(), "Service must override and set status to ORDER_CREATED");
        Assertions.assertEquals(new BigDecimal("5.0"), response.weight());
        Assertions.assertNotNull(response.pickupLocation());
        Assertions.assertNotNull(response.deliveryLocation());
    }

    @Test
    @DisplayName("changeOrderStatus - Should update order status successfully when valid status is provided")
    public void shouldChangeOrderStatusSuccessfully() {
        UUID orderId = UUID.randomUUID();
        Order mockOrder = new Order();
        mockOrder.id = orderId;
        mockOrder.status = OrderStatus.ORDER_CREATED;
        mockOrder.weight = new BigDecimal("10.5");
        PanacheMock.mock(Order.class);
        Mockito.when(Order.findByIdOptional(orderId)).thenReturn(Optional.of(mockOrder));
        OrderResponseDTO result = orderService.changeOrderStatus(orderId, OrderStatus.ORDER_CREATED);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(OrderStatus.ORDER_CREATED, result.status(), "Status should be ORDER_CREATED");
        Assertions.assertEquals(new BigDecimal("10.5"), result.weight(), "Weight should match");
    }

    @Test
    @DisplayName("changeOrderStatus - Should throw BadRequestException when trying to set null status")
    public void shouldThrowExceptionWhenTryingToSetNullStatus() {
        Assertions.assertThrows(
                BadRequestException.class,
                () -> orderService.changeOrderStatus(UUID.randomUUID(), null),
                "Should throw exception when newStatus is null"
        );
    }

    @Test
    @DisplayName("deleteOrder - Should throw ResourceNotFoundException if trying to delete non-existent order")
    public void shouldThrowExceptionOnDeletingNonExistentOrder() {
        UUID fakeId = UUID.randomUUID();
        PanacheMock.mock(Order.class);
        Mockito.when(Order.deleteById(fakeId)).thenReturn(false);

        Assertions.assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.deleteOrder(fakeId),
                "Should throw exception when deleteById returns false"
        );
    }
}