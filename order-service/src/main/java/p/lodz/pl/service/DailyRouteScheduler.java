package p.lodz.pl.service;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;
import p.lodz.pl.client.UserServiceClient;
import p.lodz.pl.dto.UserDTO;
import p.lodz.pl.model.*;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.model.enums.RouteStatus;
import p.lodz.pl.repository.OrderRepository;
import p.lodz.pl.repository.RouteRepository;
import p.lodz.pl.repository.RouteStopRepository;
import p.lodz.pl.util.Util;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@ApplicationScoped
public class DailyRouteScheduler {

    private static final Logger LOG = Logger.getLogger(DailyRouteScheduler.class);

    @Inject
    RouteOptimizationService routeOptimizationService;

    @Inject
    AlgorithmSettingsService settingsService;

    @Inject
    RouteRepository routeRepository;

    @Inject
    RouteStopRepository routeStopRepository;

    @Inject
    OrderRepository orderRepository;

    @Inject
    @RestClient
    UserServiceClient userServiceClient;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void optimizeMidnightRoutes() {
        LOG.info("I'm going to optimize midnight routes");
        try {
            prepareNewOrdersForRouting();
            executeOptimization();
        } catch (Exception e) {
            LOG.error("There was an error in night scheduler: ", e);
        }
    }

    @Transactional
    public void forceImmediateOptimization() throws ExecutionException, InterruptedException {
        LOG.info("Admin triggered immediate optimization of routes");
        prepareNewOrdersForRouting();
        executeOptimization();
    }

    private void prepareNewOrdersForRouting() {
        List<Order> ordersToPickup = orderRepository.list("status", OrderStatus.ORDER_CREATED);
        List<Order> ordersToDeliver = orderRepository.list("status", OrderStatus.IN_SORTING_CENTER);

        List<Order> allOrdersToRoute = new ArrayList<>();
        allOrdersToRoute.addAll(ordersToPickup);
        allOrdersToRoute.addAll(ordersToDeliver);

        if (allOrdersToRoute.isEmpty()) {
            LOG.info("No orders to route pickup found");
            return;
        }

        List<UserDTO> couriers;
        try {
            couriers = userServiceClient.getCouriers();
        } catch (Exception e) {
            LOG.error("Error in getting couriers", e);
            throw new RuntimeException("There was an error fetching couriers from user-service.", e);
        }

        if (couriers == null || couriers.isEmpty()) {
            LOG.warn("System did not find any couriers");
            return;
        }

        List<Route> activeRoutes = new ArrayList<>();

        for (UserDTO courier : couriers) {
            Route existingRoute = routeRepository.find("courierId = ?1 and status = ?2",
                    courier.id(), RouteStatus.PENDING).firstResult();

            if (existingRoute == null) {
                existingRoute = new Route();
                existingRoute.courierId = courier.id();
                existingRoute.status = RouteStatus.PENDING;
                routeRepository.persist(existingRoute);
            }
            activeRoutes.add(existingRoute);
        }

        int routeIndex = 0;

        for (Order order : allOrdersToRoute) {
            Route currentRoute = activeRoutes.get(routeIndex % activeRoutes.size());

            if (currentRoute.stops == null) {
                currentRoute.stops = new ArrayList<>();
            }

            int currentSequence = currentRoute.stops.size();

            RouteStop stop = routeStopRepository.find("order = ?1", order).firstResult();
            boolean isNew = false;

            if (stop == null) {
                stop = new RouteStop();
                stop.order = order;
                isNew = true;
            }

            stop.route = currentRoute;
            stop.stopSequence = currentSequence;
            stop.estimatedArrivalTime = null;

            if (isNew) {
                routeStopRepository.persist(stop);
            }

            currentRoute.stops.add(stop);

            if (order.status == OrderStatus.ORDER_CREATED) {
                order.status = OrderStatus.CALCULATING_ROUTE_RECEIVE;
            } else if (order.status == OrderStatus.IN_SORTING_CENTER) {
                order.status = OrderStatus.CALCULATING_ROUTE_DELIVERY;
            }

            routeIndex++;
        }

        LOG.infof("Prepared %d orders for routing across %d couriers.",
                allOrdersToRoute.size(), couriers.size());
    }

    private void executeOptimization() throws ExecutionException, InterruptedException {
        AlgorithmType currentAlgo = settingsService.getCurrentAlgorithm();

        List<Route> routes = routeRepository.list("status", RouteStatus.PENDING);
        List<RouteStop> stops = routeStopRepository.list("route.status", RouteStatus.PENDING);

        if (routes.isEmpty() || stops.isEmpty()) {
            LOG.info("There are no routes or stops to optimize. Skipping optimization.");
            return;
        }

        for (Route route : routes) {
            org.hibernate.Hibernate.initialize(route.stops);
        }
        for (RouteStop stop : stops) {
            org.hibernate.Hibernate.initialize(stop.order);
            if (stop.order != null) {
                org.hibernate.Hibernate.initialize(stop.order.deliveryLocation);
                org.hibernate.Hibernate.initialize(stop.order.pickupLocation);
            }
        }

        RoutePlan problem = new RoutePlan(routes, stops);

        RoutePlan optimizedPlan = routeOptimizationService.optimizeRoutes(problem, currentAlgo);

        for (Route route : optimizedPlan.routes) {
            if (route.stops == null || route.stops.isEmpty()) {
                route.totalDistanceKm = BigDecimal.ZERO;
                route.estimatedDurationMin = 0;
                continue;
            }

            double totalRouteDistance = 0.0;
            Instant currentTime = Instant.now().truncatedTo(ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS);

            for (int i = 0; i < route.stops.size(); i++) {
                RouteStop currentStop = route.stops.get(i);

                if (i > 0) {
                    Location prevLoc = getTargetLocation(route.stops.get(i - 1).order);
                    Location currLoc = getTargetLocation(currentStop.order);

                    if (prevLoc != null && currLoc != null) {
                        double distanceMeters = Util.calculateDistance(prevLoc, currLoc);
                        totalRouteDistance += (distanceMeters / 1000.0);
                        long travelTimeMinutes = (long) ((distanceMeters / 1000.0) * 2);
                        currentTime = currentTime.plus(travelTimeMinutes, ChronoUnit.MINUTES);
                    }
                }

                currentStop.estimatedArrivalTime = currentTime;
                currentTime = currentTime.plus(5, ChronoUnit.MINUTES);

                if (currentStop.order != null) {
                    if (currentStop.order.status == OrderStatus.CALCULATING_ROUTE_RECEIVE) {
                        currentStop.order.status = OrderStatus.ROUTE_ASSIGNED_RECEIVE;
                    } else if (currentStop.order.status == OrderStatus.CALCULATING_ROUTE_DELIVERY) {
                        currentStop.order.status = OrderStatus.ROUTE_ASSIGNED_DELIVERY;
                    }
                }
            }

            route.totalDistanceKm = BigDecimal.valueOf(totalRouteDistance);
            route.estimatedDurationMin = (int) ChronoUnit.MINUTES.between(
                    Instant.now().truncatedTo(ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS),
                    currentTime
            );
        }

        LOG.info("Optimization started with alg: " + currentAlgo);
    }

    private Location getTargetLocation(Order order) {
        if (order == null) return null;
        if (order.status == OrderStatus.CALCULATING_ROUTE_RECEIVE || order.status == OrderStatus.ROUTE_ASSIGNED_RECEIVE) {
            return order.pickupLocation;
        }
        return order.deliveryLocation;
    }
}