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
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class BruteForceRoutingStrategy implements RoutingStrategy {

    private static final int MAX_CHUNK_SIZE = 8;

    private List<RouteStop> bestRouteStops;
    private double minTotalDistance;

    @Override
    public RoutePlan solve(RoutePlan problem) {
        if (problem.routes == null || problem.routes.isEmpty() || problem.stops == null || problem.stops.isEmpty()) {
            return problem;
        }

        for (Route r : problem.routes) {
            if (r.stops != null) {
                r.stops.clear();
            } else {
                r.stops = new ArrayList<>();
            }
        }

        List<RouteStop> allStops = new ArrayList<>(problem.stops);
        List<List<RouteStop>> courierAssignments = new ArrayList<>();
        for (int i = 0; i < problem.routes.size(); i++) {
            courierAssignments.add(new ArrayList<>());
        }

        for (int i = 0; i < allStops.size(); i++) {
            courierAssignments.get(i % problem.routes.size()).add(allStops.get(i));
        }

        for (int i = 0; i < problem.routes.size(); i++) {
            Route currentRoute = problem.routes.get(i);
            List<RouteStop> assignedStops = courierAssignments.get(i);
            List<RouteStop> finalOptimizedStops = new ArrayList<>();

            for (int j = 0; j < assignedStops.size(); j += MAX_CHUNK_SIZE) {
                int end = Math.min(j + MAX_CHUNK_SIZE, assignedStops.size());
                List<RouteStop> chunk = new ArrayList<>(assignedStops.subList(j, end));

                bestRouteStops = null;
                minTotalDistance = Double.MAX_VALUE;

                generatePermutations(chunk, 0);

                finalOptimizedStops.addAll(bestRouteStops);
            }

            for (int k = 0; k < finalOptimizedStops.size(); k++) {
                RouteStop stop = finalOptimizedStops.get(k);
                stop.route = currentRoute;
                stop.stopSequence = k;
            }

            currentRoute.stops.addAll(finalOptimizedStops);
        }

        return problem;
    }

    private void generatePermutations(List<RouteStop> arr, int k) {
        if (k == arr.size()) {
            double currentDistance = calculateTotalDistance(arr);
            if (currentDistance < minTotalDistance) {
                minTotalDistance = currentDistance;
                bestRouteStops = new ArrayList<>(arr);
            }
            return;
        }
        for (int i = k; i < arr.size(); i++) {
            Collections.swap(arr, i, k);
            generatePermutations(arr, k + 1);
            Collections.swap(arr, k, i);
        }
    }

    private double calculateTotalDistance(List<RouteStop> stops) {
        double distance = 0;
        for (int i = 0; i < stops.size() - 1; i++) {
            Location loc1 = getTargetLocation(stops.get(i).order);
            Location loc2 = getTargetLocation(stops.get(i + 1).order);

            if (loc1 != null && loc2 != null) {
                distance += Util.calculateDistance(loc1, loc2);
            }
        }
        return distance;
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
        return AlgorithmType.BRUTE_FORCE;
    }
}