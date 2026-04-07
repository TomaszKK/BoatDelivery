package p.lodz.pl.service.routing;

import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.model.RoutePlan;
import p.lodz.pl.util.Util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class GreedyRoutingStrategy implements RoutingStrategy {

    @Override
    public RoutePlan solve(RoutePlan problem) {
        if (problem.routes == null || problem.routes.isEmpty() || problem.stops == null || problem.stops.isEmpty()) {
            return problem;
        }

        Map<Route, Location> currentCourierLocations = new HashMap<>();
        Map<Route, Integer> courierSequences = new HashMap<>();

        for (Route r : problem.routes) {
            if (r.stops != null) {
                r.stops.clear();
            } else {
                r.stops = new ArrayList<>();
            }
            currentCourierLocations.put(r, null); // Na start kurierzy nie mają lokalizacji (dystans do 1 paczki = 0)
            courierSequences.put(r, 0);
        }

        List<RouteStop> unassignedStops = new ArrayList<>(problem.stops);

        while (!unassignedStops.isEmpty()) {
            Route bestRoute = null;
            RouteStop bestStop = null;
            double minDistance = Double.MAX_VALUE;

            for (Route candidateRoute : problem.routes) {
                Location currentLoc = currentCourierLocations.get(candidateRoute);

                for (RouteStop candidateStop : unassignedStops) {
                    Location candidateLoc = getTargetLocation(candidateStop.order);

                    double distance = 0.0;
                    if (currentLoc != null && candidateLoc != null) {
                        distance = Util.calculateDistance(currentLoc, candidateLoc);
                    }

                    if (distance < minDistance) {
                        minDistance = distance;
                        bestRoute = candidateRoute;
                        bestStop = candidateStop;
                    }
                }
            }

            if (bestStop == null || bestRoute == null) {
                bestStop = unassignedStops.getFirst();
                bestRoute = problem.routes.getFirst();
            }

            int sequence = courierSequences.get(bestRoute);
            bestStop.route = bestRoute;
            bestStop.stopSequence = sequence;
            bestRoute.stops.add(bestStop);

            courierSequences.put(bestRoute, sequence + 1);
            currentCourierLocations.put(bestRoute, getTargetLocation(bestStop.order));

            unassignedStops.remove(bestStop);
        }

        return problem;
    }

    private Location getTargetLocation(Order order) {
        if (order == null) return null;
        if (order.status == OrderStatus.CALCULATING_ROUTE_RECEIVE || order.status == OrderStatus.ROUTE_ASSIGNED_RECEIVE) {
            return order.pickupLocation;
        }
        return order.deliveryLocation;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.GREEDY_SIMPLE;
    }
}