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
import java.util.Map;
import java.util.HashMap;

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
        }

        List<List<RouteStop>> courierAssignments = new ArrayList<>();
        for (int i = 0; i < solution.routes.size(); i++) {
            courierAssignments.add(new ArrayList<>());
        }

        Map<Integer, Double> courierLoads = new HashMap<>();
        Map<Integer, Double> courierTimes = new HashMap<>();
        Map<Integer, Location> courierLocations = new HashMap<>();
        Location depot = DailyRouteScheduler.createDepotLocation();

        for (int i = 0; i < solution.routes.size(); i++) {
            courierLoads.put(i, 0.0);
            courierTimes.put(i, 0.0);
            courierLocations.put(i, depot);
        }

        // 1. Wstępny podział uwzględniający ładowność i limit czasu (8h = 480 min)
        for (RouteStop stop : clonedStops) {
            int startIdx = Math.abs(stop.id != null ? stop.id.hashCode() : stop.hashCode()) % solution.routes.size();

            for (int offset = 0; offset < solution.routes.size(); offset++) {
                int courierIdx = (startIdx + offset) % solution.routes.size();
                Route candidateRoute = solution.routes.get(courierIdx);

                if (candidateRoute.maxCargoCapacity <= 0) continue;

                double weight = stop.order != null && stop.order.weight != null ? stop.order.weight.doubleValue() : 0.0;
                double currentLoad = courierLoads.get(courierIdx);

                if (currentLoad + weight > candidateRoute.maxCargoCapacity) {
                    continue; // Przekroczono pojemność
                }

                Location targetLoc = DailyRouteScheduler.getTargetLocation(stop.order);
                Location currentLoc = courierLocations.get(courierIdx);
                double distance = (currentLoc != null && targetLoc != null) ? Util.calculateDistance(currentLoc, targetLoc) : 0.0;
                double distanceToDepot = targetLoc != null ? Util.calculateDistance(targetLoc, depot) : 0.0;

                double travelTime = (distance / 1000.0) * 2.0;
                double returnTime = (distanceToDepot / 1000.0) * 2.0;
                double projectedTime = courierTimes.get(courierIdx) + travelTime + returnTime + 10.0;

                if (projectedTime > 480.0) {
                    continue; // Przekroczono limit czasu pracy
                }

                // Przypisanie
                courierLoads.put(courierIdx, currentLoad + weight);
                courierTimes.put(courierIdx, courierTimes.get(courierIdx) + travelTime + 10.0);
                courierLocations.put(courierIdx, targetLoc);

                courierAssignments.get(courierIdx).add(stop);
                solution.stops.add(stop); // Dodanie do finalnego rozwiązania
                break;
            }
        }

        // 2. Optymalizacja przydzielonych paczek w porcjach (Chunks)
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

                if (bestRouteStops != null) {
                    finalOptimizedStops.addAll(bestRouteStops);
                }
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