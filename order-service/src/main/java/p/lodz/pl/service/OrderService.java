package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.dto.OrderResponseDTO;
import p.lodz.pl.exception.ResourceNotFoundException;
import p.lodz.pl.mapper.OrderMapper;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.enums.OrderStatus;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class OrderService {

    @Inject
    OrderMapper orderMapper;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO requestDTO) {
        Order order = orderMapper.toEntity(requestDTO);
        order.status = OrderStatus.NEW;

        if (order.deliveryLocation != null) {
            order.deliveryLocation.order = order;
        }

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
        if (order.deliveryLocation != null && order.deliveryLocation.order == null) {
            order.deliveryLocation.order = order;
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