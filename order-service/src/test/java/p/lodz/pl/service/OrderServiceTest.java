package p.lodz.pl.service;

import io.quarkus.panache.mock.PanacheMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import p.lodz.pl.dto.OrderResponseDTO;
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
        mockOrder.status = OrderStatus.NEW;
        mockOrder.weight = new BigDecimal("10.5");

        PanacheMock.mock(Order.class);
        Mockito.when(Order.findByIdOptional(orderId)).thenReturn(Optional.of(mockOrder));

        OrderResponseDTO result = orderService.getOrderById(orderId);

        Assertions.assertNotNull(result, "Result should not be null");
        Assertions.assertEquals(orderId, result.id(), "ID should match");
        Assertions.assertEquals(OrderStatus.NEW, result.status(), "Status should be NEW");
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
}