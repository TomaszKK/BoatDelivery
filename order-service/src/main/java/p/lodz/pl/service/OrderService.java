package p.lodz.pl.service;

import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import org.eclipse.microprofile.jwt.JsonWebToken;
import p.lodz.pl.dto.OrderMinimalizedResponseDTO;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.dto.OrderResponseDTO;
import p.lodz.pl.dto.PageResponseDTO;
import p.lodz.pl.dto.maps.HerePosition;
import p.lodz.pl.exception.BadRequestException;
import p.lodz.pl.exception.ResourceNotFoundException;
import p.lodz.pl.mapper.OrderMapper;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.repository.OrderRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static p.lodz.pl.util.Util.generateTrackingNumber;

@ApplicationScoped
public class OrderService {

    @Inject
    OrderMapper orderMapper;

    @Inject
    JsonWebToken jwt;

    @Inject
    SecurityIdentity identity;

    @Inject
    OrderRepository orderRepository;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO requestDTO, HerePosition pickupPos, HerePosition deliveryPos) {
        Order order = orderMapper.toEntity(requestDTO);
        order.status = OrderStatus.ORDER_CREATED;
        order.trackingNumber = generateTrackingNumber();

        order.customerId = UUID.fromString(jwt.getSubject());

        order.pickupLocation.latitude = pickupPos.lat();
        order.pickupLocation.longitude = pickupPos.lng();

        order.deliveryLocation.latitude = deliveryPos.lat();
        order.deliveryLocation.longitude = deliveryPos.lng();

        order.persist();

        return orderMapper.toDto(order);
    }

    public List<OrderResponseDTO> getOrders() {
        if (identity.hasRole("ADMIN")) {
            return Order.<Order>listAll().stream()
                    .map(orderMapper::toDto)
                    .collect(Collectors.toList());
        } else {
            UUID customerId = UUID.fromString(jwt.getSubject());
            return Order.<Order>list("customerId", customerId).stream()
                    .map(orderMapper::toDto)
                    .collect(Collectors.toList());
        }
    }

    public OrderResponseDTO getOrderById(UUID id) {
        Order order = Order.<Order>findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));

        verifyOwnership(order);
        return orderMapper.toDto(order);
    }

    public OrderMinimalizedResponseDTO getOrderByTrackingNumberMinimalized(String trackingNumber) {
        Order order = Order.<Order>find("trackingNumber", trackingNumber).firstResultOptional()
                .orElseThrow(() -> new ResourceNotFoundException("Order with tracking number " + trackingNumber + " not found"));
        verifyOwnership(order);
        return orderMapper.toMinimalizedDto(order);
    }

    public OrderResponseDTO getOrderByTrackingNumber(String trackingNumber) {
        Order order = Order.<Order>find("trackingNumber", trackingNumber).firstResultOptional()
                .orElseThrow(() -> new ResourceNotFoundException("Order with tracking number " + trackingNumber + " not found"));

        verifyOwnership(order);
        return orderMapper.toDto(order);
    }

    @Transactional
    public OrderResponseDTO updateOrder(UUID id, OrderRequestDTO requestDTO) {
        Order order = Order.<Order>findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found"));

        verifyOwnership(order);
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

        verifyOwnership(order);

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
            // TODO: Notyfikacja dla kuriera
        } else {
            order.status = OrderStatus.ORDER_CANCELED;
        }

        return orderMapper.toDto(order);
    }

    @Transactional
    public void deleteOrder(String id) {
        Order order = Order.<Order>find("trackingNumber", id).firstResultOptional()
                .orElseThrow(() -> new ResourceNotFoundException("Order with trackingNumber " + id + " not found"));

        verifyOwnership(order);
        order.delete();
    }

    @Transactional
    public List<OrderResponseDTO> getOrdersByCustomerId(String customerId) {
        return orderRepository.list("customerId", UUID.fromString(customerId))
                .stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PageResponseDTO<OrderResponseDTO> getOrdersPaged(int page, int size, OrderStatus status) {
        io.quarkus.hibernate.orm.panache.PanacheQuery<Order> query;

        if (status != null) {
            query = orderRepository.find("status", status);
        } else {
            query = orderRepository.findAll();
        }

        query.page(io.quarkus.panache.common.Page.of(page, size));

        List<OrderResponseDTO> content = query.stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        return new PageResponseDTO<>(
                content,
                page,
                query.pageCount(),
                query.count()
        );
    }

    @Transactional
    public Map<String, Long> getAdminStatistics() {
        Map<String, Long> stats = new HashMap<>();

        long pendingPickups = orderRepository.count("status", OrderStatus.ORDER_CREATED);
        long inSortingCenter = orderRepository.count("status", OrderStatus.IN_SORTING_CENTER);
        long delivered = orderRepository.count("status", OrderStatus.DELIVERY_COMPLETED);

        stats.put("pendingPickups", pendingPickups);
        stats.put("inSortingCenter", inSortingCenter);
        stats.put("delivered", delivered);

        return stats;
    }

    private void verifyOwnership(Order order) {
        if (identity.hasRole("ADMIN") || identity.hasRole("COURIER")) {
            return;
        }

        String currentUserId = jwt.getSubject();
        if (!order.customerId.toString().equals(currentUserId)) {
            throw new ForbiddenException("Access denied: You are not the owner of this order");
        }
    }
}