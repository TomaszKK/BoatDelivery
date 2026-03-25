package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.dto.OrderResponseDTO;
import p.lodz.pl.exception.BadRequestException;
import p.lodz.pl.exception.ResourceNotFoundException;
import p.lodz.pl.mapper.OrderMapper;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.enums.OrderStatus;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static p.lodz.pl.util.Util.generateTrackingNumber;

@ApplicationScoped
public class OrderService {

    @Inject
    OrderMapper orderMapper;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO requestDTO) {
        Order order = orderMapper.toEntity(requestDTO);
        order.status = OrderStatus.ORDER_CREATED;

        order.trackingNumber = generateTrackingNumber();

        order.persist();
        return orderMapper.toDto(order);
    }

    public List<OrderResponseDTO> getAllOrders() {
        return Order.<Order>listAll().stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(UUID id) {
        Order order = Order.<Order>findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));
        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderResponseDTO updateOrder(UUID id, OrderRequestDTO requestDTO) {
        Order order = Order.<Order>findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));
        orderMapper.updateEntityFromDto(requestDTO, order);

        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderResponseDTO changeOrderStatus(UUID id, OrderStatus newStatus) {
        if (newStatus == null) {
            throw new BadRequestException("Order status cannot be null");
        }
        Order order = Order.<Order>findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));

        if (newStatus == OrderStatus.ORDER_CANCELED) {
            return handleCancellation(order);
        }

        order.status = newStatus;
        return orderMapper.toDto(order);
    }

    private OrderResponseDTO handleCancellation(Order order) {
        boolean isAlreadyPickedUp = List.of(
                OrderStatus.ORDER_RECEIVED_FROM_CUSTOMER,
                OrderStatus.IN_SORTING_CENTER,
                OrderStatus.CALCULATING_ROUTE_DELIVERY,
                OrderStatus.ROUTE_ASSIGNED_DELIVERY,
                OrderStatus.IN_TRANSIT_TO_CUSTOMER
        ).contains(order.status);

        if (isAlreadyPickedUp) {
            order.status = OrderStatus.IN_SORTING_CENTER;

            Location tempDelivery = order.deliveryLocation;
            order.deliveryLocation = order.pickupLocation;
            order.pickupLocation = tempDelivery;
//            TODO add notification about cancelling order after receiving. This is important for driver, because he will have to return to sorting center instead of going to customer.
        } else {
            order.status = OrderStatus.ORDER_CANCELED;
        }

        return orderMapper.toDto(order);
    }

    @Transactional
    public void deleteOrder(UUID id) {
        boolean deleted = Order.deleteById(id);
        if (!deleted) {
            throw new ResourceNotFoundException("Order with id " + id + " not found");
        }
    }
}