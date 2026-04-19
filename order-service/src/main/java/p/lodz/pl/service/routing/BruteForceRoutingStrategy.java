package p.lodz.pl.service.routing;

import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.RoutePlan;
import p.lodz.pl.service.DailyRouteScheduler;
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

        RoutePlan solution = new RoutePlan();
        solution.routes = new ArrayList<>();
        solution.stops = new ArrayList<>();

        for (Route origRoute : problem.routes) {
            Route clonedRoute = new Route();
            clonedRoute.id = origRoute.id;
            clonedRoute.maxCargoCapacity = origRoute.maxCargoCapacity != null ? origRoute.maxCargoCapacity : 0.0;
            clonedRoute.stops = new ArrayList<>();
            solution.routes.add(clonedRoute);
        }

        List<RouteStop> clonedStops = new ArrayList<>();
        for (RouteStop origStop : problem.stops) {
            RouteStop clonedStop = new RouteStop();
            clonedStop.id = origStop.id;
            clonedStop.order = origStop.order;
            clonedStops.add(clonedStop);
            solution.stops.add(clonedStop);
        }

        List<List<RouteStop>> courierAssignments = new ArrayList<>();
        for (int i = 0; i < solution.routes.size(); i++) {
            courierAssignments.add(new ArrayList<>());
        }

        for (int i = 0; i < clonedStops.size(); i++) {
            courierAssignments.get(i % solution.routes.size()).add(clonedStops.get(i));
        }

        for (int i = 0; i < solution.routes.size(); i++) {
            Route currentRoute = solution.routes.get(i);
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

        return solution;
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
        if (stops == null || stops.isEmpty()) return 0;

        Location depot = DailyRouteScheduler.createDepotLocation();

        Location firstLoc = DailyRouteScheduler.getTargetLocation(stops.getFirst().order);
        if (firstLoc != null) {
            distance += Util.calculateDistance(depot, firstLoc);
        }

        for (int i = 0; i < stops.size() - 1; i++) {
            Location loc1 = DailyRouteScheduler.getTargetLocation(stops.get(i).order);
            Location loc2 = DailyRouteScheduler.getTargetLocation(stops.get(i + 1).order);

            if (loc1 != null && loc2 != null) {
                distance += Util.calculateDistance(loc1, loc2);
            }
        }

        Location lastLoc = DailyRouteScheduler.getTargetLocation(stops.getLast().order);
        if (lastLoc != null) {
            distance += Util.calculateDistance(lastLoc, depot);
        }

        return distance;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.BRUTE_FORCE;
    }
}