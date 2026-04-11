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

    // Zdefiniowana Główna Sortownia (Urząd Celno-Skarbowy, Lodowa 97)
    public static Location createDepotLocation() {
        Location depot = new Location();
        depot.latitude = new BigDecimal("51.745000");
        depot.longitude = new BigDecimal("19.495000");
        depot.streetAddress = "Lodowa 97";
        depot.postalCode = "93-232";
        depot.city = "Łódź";
        depot.country = "Polska";
        return depot;
    }

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

                if (courier.transport() != null && courier.transport().cargoCapacity() != null) {
                    existingRoute.maxCargoCapacity = courier.transport().cargoCapacity();
                } else {
                    existingRoute.maxCargoCapacity = 1000.0;
                }

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
        Location depot = createDepotLocation();

        for (Route optRoute : optimizedPlan.routes) {
            Route realRoute = routeRepository.findById(optRoute.id);
            if (realRoute == null) continue;

            if (optRoute.stops == null || optRoute.stops.isEmpty()) {
                realRoute.totalDistanceKm = BigDecimal.ZERO;
                realRoute.estimatedDurationMin = 0;
                continue;
            }

            double totalRouteDistance = 0.0;
            Instant currentTime = Instant.now().truncatedTo(ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS); // Start o 08:00 CEST z bazy

            Location firstLoc = getTargetLocation(optRoute.stops.getFirst().order);
            if (firstLoc != null) {
                double distanceToFirst = Util.calculateDistance(depot, firstLoc);
                totalRouteDistance += (distanceToFirst / 1000.0);
                long travelTime = (long) ((distanceToFirst / 1000.0) * 2);
                currentTime = currentTime.plus(travelTime, ChronoUnit.MINUTES);
            }

            for (int i = 0; i < optRoute.stops.size(); i++) {
                RouteStop optStop = optRoute.stops.get(i);
                RouteStop realStop = routeStopRepository.findById(optStop.id);

                if (realStop == null) continue;

                if (i > 0) {
                    Location prevLoc = getTargetLocation(optRoute.stops.get(i - 1).order);
                    Location currLoc = getTargetLocation(realStop.order);

                    if (prevLoc != null && currLoc != null) {
                        double distanceMeters = Util.calculateDistance(prevLoc, currLoc);
                        totalRouteDistance += (distanceMeters / 1000.0);
                        long travelTimeMinutes = (long) ((distanceMeters / 1000.0) * 2);
                        currentTime = currentTime.plus(travelTimeMinutes, ChronoUnit.MINUTES);
                    }
                }

                realStop.estimatedArrivalTime = currentTime;
                realStop.stopSequence = i;
                realStop.route = realRoute;

                currentTime = currentTime.plus(10, ChronoUnit.MINUTES); // 10 minut na obsługę punktu

                if (realStop.order != null) {
                    if (realStop.order.status == OrderStatus.CALCULATING_ROUTE_RECEIVE) {
                        realStop.order.status = OrderStatus.ROUTE_ASSIGNED_RECEIVE;
                    } else if (realStop.order.status == OrderStatus.CALCULATING_ROUTE_DELIVERY) {
                        realStop.order.status = OrderStatus.ROUTE_ASSIGNED_DELIVERY;
                    }
                }
            }

            Location lastLoc = getTargetLocation(optRoute.stops.getLast().order);
            if (lastLoc != null) {
                double distanceToDepot = Util.calculateDistance(lastLoc, depot);
                totalRouteDistance += (distanceToDepot / 1000.0);
                long travelTime = (long) ((distanceToDepot / 1000.0) * 2);
                currentTime = currentTime.plus(travelTime, ChronoUnit.MINUTES);
            }

            realRoute.totalDistanceKm = BigDecimal.valueOf(totalRouteDistance);
            realRoute.estimatedDurationMin = (int) ChronoUnit.MINUTES.between(
                    Instant.now().truncatedTo(ChronoUnit.DAYS).plus(6, ChronoUnit.HOURS),
                    currentTime
            );
        }

        routeStopRepository.flush();
        LOG.info("Optimization completed and saved with alg: " + currentAlgo);
    }

    public static Location getTargetLocation(Order order) {
        if (order == null) return null;
        if (order.status == OrderStatus.CALCULATING_ROUTE_RECEIVE || order.status == OrderStatus.ROUTE_ASSIGNED_RECEIVE || order.status == OrderStatus.ORDER_CREATED) {
            return order.pickupLocation;
        }
        return order.deliveryLocation;
    }

    public static boolean isDelivery(Order order) {
        return order.status == OrderStatus.IN_SORTING_CENTER ||
                order.status == OrderStatus.CALCULATING_ROUTE_DELIVERY ||
                order.status == OrderStatus.ROUTE_ASSIGNED_DELIVERY;
    }
}