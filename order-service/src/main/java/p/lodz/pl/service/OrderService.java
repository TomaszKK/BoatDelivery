package p.lodz.pl.service;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import p.lodz.pl.client.UserServiceClient;
import p.lodz.pl.dto.*;
import p.lodz.pl.dto.maps.HerePosition;
import p.lodz.pl.exception.BadRequestException;
import p.lodz.pl.exception.ResourceNotFoundException;
import p.lodz.pl.mapper.OrderMapper;
import p.lodz.pl.messaging.OrderEventPublisher;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.repository.OrderRepository;

import java.util.*;
import java.util.stream.Collectors;

import static p.lodz.pl.util.Util.generateTrackingNumber;

@ApplicationScoped
public class OrderService {

    @Inject
    OrderMapper orderMapper;

    @Inject
    @RestClient
    UserServiceClient userServiceClient;

    @Inject
    JsonWebToken jwt;

    @Inject
    SecurityIdentity identity;

    @Inject
    OrderRepository orderRepository;

    @Inject
    OrderEventPublisher eventPublisher;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO requestDTO, HerePosition pickupPos, HerePosition deliveryPos) {
        Order order = orderMapper.toEntity(requestDTO);
        order.status = OrderStatus.WAITING_FOR_PAYMENT;
        order.trackingNumber = generateTrackingNumber();

        order.customerId = UUID.fromString(jwt.getSubject());

        order.pickupLocation.latitude = pickupPos.lat();
        order.pickupLocation.longitude = pickupPos.lng();

        order.deliveryLocation.latitude = deliveryPos.lat();
        order.deliveryLocation.longitude = deliveryPos.lng();

        order.persist();

        return orderMapper.toDto(order);
    }

    @Transactional
    public void markOrderAsPaid(java.util.UUID orderId) {
        Order order = Order.findById(orderId);

        if (order != null && order.status == OrderStatus.WAITING_FOR_PAYMENT) {
            order.status = OrderStatus.ORDER_CREATED;
            order.persist();

            eventPublisher.publishOrderChange(order);

            System.out.println("Zlecenie " + orderId + " opłacone pomyślnie. Paczka trafia do obiegu.");
        } else {
            System.err.println("Nie można zaktualizować statusu dla zamówienia: " + orderId);
        }
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
        eventPublisher.publishOrderChange(order);
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
        eventPublisher.publishOrderChange(order);
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
        eventPublisher.publishOrderChange(order);
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
    public PageResponseDTO<OrderResponseDTO> getOrdersPaged(int page, int size, OrderStatus status, String search) {
        PanacheQuery<Order> query;
        Map<String, Object> params = new HashMap<>();

        StringBuilder queryBuilder = new StringBuilder("1=1");

        if (status != null) {
            queryBuilder.append(" AND status = :status");
            params.put("status", status);
        }

        if (search != null && !search.trim().isEmpty()) {
            queryBuilder.append(" AND lower(trackingNumber) LIKE :search");
            params.put("search", "%" + search.trim().toLowerCase() + "%");
        }

        query = orderRepository.find(queryBuilder.toString(), params);
        query.page(Page.of(page, size));

        List<OrderResponseDTO> content = query.stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());

        List<OrderResponseDTO> enrichedContent = enrichOrdersWithCourierData(content);

        return new PageResponseDTO<>(
                enrichedContent,
                page,
                query.pageCount(),
                query.count()
        );
    }

    private List<OrderResponseDTO> enrichOrdersWithCourierData(List<OrderResponseDTO> dtoList) {
        if (dtoList == null || dtoList.isEmpty()) return dtoList;

        Map<String, CourierInfoDTO> couriersMap = new HashMap<>();
        try {
            List<UserDTO> couriers = userServiceClient.getCouriers();

            for (UserDTO user : couriers) {
                CourierInfoDTO c = new CourierInfoDTO(
                        String.valueOf(user.id()),
                        user.firstName(),
                        user.lastName(),
                        user.email(),
                        null
                );
                couriersMap.put(c.id(), c);
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }

        List<OrderResponseDTO> enrichedList = new ArrayList<>();

        for (OrderResponseDTO dto : dtoList) {
            UUID courierId = null;
            CourierInfoDTO courierInfo = null;

            Order orderEntity = Order.findById(dto.id());
            if (orderEntity != null) {
                RouteStop stop = RouteStop.find("order", orderEntity).firstResult();
                if (stop != null && stop.route != null && stop.route.courierId != null) {
                    courierId = stop.route.courierId;
                }
            }

            if (courierId != null && couriersMap.containsKey(courierId.toString())) {
                courierInfo = couriersMap.get(courierId.toString());
            }

            OrderResponseDTO enrichedDto = new OrderResponseDTO(
                    dto.id(),
                    dto.trackingNumber(),
                    dto.customerId(),
                    dto.status(),
                    dto.weight(),
                    dto.volume(),
                    dto.createdAt(),
                    dto.recipientFirstName(),
                    dto.recipientLastName(),
                    dto.recipientEmail(),
                    dto.recipientPhone(),
                    dto.pickupLocation(),
                    dto.deliveryLocation(),
                    courierInfo
            );

            enrichedList.add(enrichedDto);
        }

        return enrichedList;
    }

    @Transactional
    public Map<String, Long> getAdminStatistics() {
        List<Object[]> results = orderRepository.find("SELECT status, COUNT(*) FROM Order GROUP BY status").project(Object[].class).list();
        Map<String, Long> stats = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            stats.put(status.name(), 0L);
        }

        for (Object[] result : results) {
            OrderStatus status = (OrderStatus) result[0];
            Long count = (Long) result[1];
            stats.put(status.name(), count);
        }

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