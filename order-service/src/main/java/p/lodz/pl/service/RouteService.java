package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import p.lodz.pl.dto.RouteResponseDTO;
import p.lodz.pl.mapper.RouteMapper;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.model.enums.RouteStatus;
import p.lodz.pl.repository.RouteRepository;
import p.lodz.pl.repository.RouteStopRepository;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class RouteService {

    @Inject
    RouteRepository routeRepository;

    @Inject
    RouteStopRepository routeStopRepository;

    @Inject
    RouteMapper routeMapper;

    @Transactional
    public List<RouteResponseDTO> getAllRoutes(String userId, boolean isAdmin) {
        List<Route> routes;

        if (isAdmin) {
            routes = routeRepository.listAll();
        } else {
            routes = routeRepository.list("courierId", UUID.fromString(userId));
        }

        routes.sort((r1, r2) -> {
            int priority1 = getRoutePriority(r1.status);
            int priority2 = getRoutePriority(r2.status);
            return Integer.compare(priority1, priority2);
        });

        for (Route route : routes) {
            if (route.stops != null) {
                route.stops.sort(Comparator.comparingInt(s -> s.stopSequence != null ? s.stopSequence : 0));
            }
        }

        return routes.stream()
                .map(routeMapper::toDto)
                .collect(Collectors.toList());
    }

    private int getRoutePriority(RouteStatus status) {
        if (status == null) return 4;
        if (status == RouteStatus.IN_PROGRESS) return 1; // Priorytet nr 1: Obecnie realizowana
        if (status == RouteStatus.PENDING) return 2;     // Priorytet nr 2: Do zrobienia
        if (status == RouteStatus.COMPLETED) return 3;   // Priorytet nr 3: Zakończona (spada na dół)
        return 4;
    }

    @Transactional
    public void startRoute(UUID routeId, String courierId) {
        Route route = routeRepository.findById(routeId);
        if (route == null) {
            throw new IllegalArgumentException("Route not found: " + routeId);
        }

        if (!route.courierId.toString().equals(courierId)) {
            throw new SecurityException("You do not have permission to start this route!");
        }

        if (route.status != RouteStatus.PENDING) {
            throw new IllegalStateException("You can only start a route that is in PENDING status!");
        }

        route.status = RouteStatus.IN_PROGRESS;

        if (route.stops != null) {
            for (RouteStop stop : route.stops) {
                if (stop.order.status == OrderStatus.ROUTE_ASSIGNED_RECEIVE) {
                    stop.order.status = OrderStatus.IN_TRANSIT_FOR_PACKAGE;
                } else if (stop.order.status == OrderStatus.ROUTE_ASSIGNED_DELIVERY) {
                    stop.order.status = OrderStatus.IN_TRANSIT_TO_CUSTOMER;
                }
            }
        }
    }

    @Transactional
    public void markStopAsCompleted(UUID stopId, String courierId) {
        RouteStop stop = routeStopRepository.findById(stopId);
        if (stop == null) {
            throw new IllegalArgumentException("No stop found with ID: " + stopId);
        }

        Route parentRoute = stop.route;
        if (!parentRoute.courierId.toString().equals(courierId)) {
            throw new SecurityException("This stop does not belong to your route!");
        }

        if (parentRoute.status != RouteStatus.IN_PROGRESS) {
            throw new IllegalStateException("You have to start ur route first!");
        }

        if (stop.order.status == OrderStatus.IN_TRANSIT_FOR_PACKAGE) {
            stop.order.status = OrderStatus.ORDER_RECEIVED_FROM_CUSTOMER;
        } else if (stop.order.status == OrderStatus.IN_TRANSIT_TO_CUSTOMER) {
            stop.order.status = OrderStatus.DELIVERY_COMPLETED;
        }

    }

    @Transactional
    public void finishRoute(UUID routeId, String courierId) {
        Route route = routeRepository.findById(routeId);
        if (route == null) {
            throw new IllegalArgumentException("No route found with ID: " + routeId);
        }

        if (!route.courierId.toString().equals(courierId)) {
            throw new SecurityException("You do not have permission to finish this route!");
        }

        if (route.status != RouteStatus.IN_PROGRESS) {
            throw new IllegalStateException("You can only finish a route that is currently IN_PROGRESS!");
        }

        if (route.stops != null) {
            boolean hasUnfinishedStops = route.stops.stream()
                    .anyMatch(stop -> stop.order.status == OrderStatus.IN_TRANSIT_FOR_PACKAGE
                            || stop.order.status == OrderStatus.IN_TRANSIT_TO_CUSTOMER);

            if (hasUnfinishedStops) {
                throw new IllegalStateException("You cannot finish the route while there are still stops in transit!");
            }
        }

        route.status = RouteStatus.COMPLETED;

        if (route.stops != null) {
            for (RouteStop stop : route.stops) {
                if (stop.order != null) {
                    if (stop.order.status == OrderStatus.ORDER_RECEIVED_FROM_CUSTOMER) {
                        stop.order.status = OrderStatus.IN_SORTING_CENTER;
                    }
                }
            }
        }
    }
}