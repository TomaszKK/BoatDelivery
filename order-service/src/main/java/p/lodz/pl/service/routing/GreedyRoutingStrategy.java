package p.lodz.pl.service.routing;

import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RoutePlan;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.service.DailyRouteScheduler;
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
        Map<Route, Double> routePeakLoad = new HashMap<>();
        Map<Route, Double> routeEndLoad = new HashMap<>();

        Location depot = DailyRouteScheduler.createDepotLocation();

        for (Route r : problem.routes) {
            if (r.stops != null) {
                r.stops.clear();
            } else {
                r.stops = new ArrayList<>();
            }
            currentCourierLocations.put(r, depot);
            courierSequences.put(r, 0);
            routePeakLoad.put(r, 0.0);
            routeEndLoad.put(r, 0.0);

            if (r.maxCargoCapacity == null) {
                r.maxCargoCapacity = 1000.0;
            }
        }

        List<RouteStop> unassignedStops = new ArrayList<>(problem.stops);

        while (!unassignedStops.isEmpty()) {
            Route bestRoute = null;
            RouteStop bestStop = null;
            double minDistance = Double.MAX_VALUE;

            for (Route candidateRoute : problem.routes) {
                Location currentLoc = currentCourierLocations.get(candidateRoute);
                double maxCapacity = candidateRoute.maxCargoCapacity;

                for (RouteStop candidateStop : unassignedStops) {
                    double orderWeight = 0.0;
                    if (candidateStop.order != null && candidateStop.order.weight != null) {
                        orderWeight = candidateStop.order.weight.doubleValue();
                    }

                    assert candidateStop.order != null;
                    boolean isDelivery = DailyRouteScheduler.isDelivery(candidateStop.order);
                    double predictedPeak = routePeakLoad.get(candidateRoute);
                    double predictedEnd = routeEndLoad.get(candidateRoute);

                    // Symulacja załadunku dla Greedy (uproszczona)
                    if (isDelivery) {
                        predictedPeak += orderWeight; // Trzeba wziąć z bazy
                    } else {
                        predictedEnd += orderWeight;
                        predictedPeak = Math.max(predictedPeak, predictedEnd);
                    }

                    if (predictedPeak > maxCapacity) {
                        continue;
                    }

                    Location candidateLoc = DailyRouteScheduler.getTargetLocation(candidateStop.order);
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

            double addedWeight = 0.0;
            if (bestStop.order != null && bestStop.order.weight != null) {
                addedWeight = bestStop.order.weight.doubleValue();
            }
            assert bestStop.order != null;
            boolean isDelivery = DailyRouteScheduler.isDelivery(bestStop.order);

            if (isDelivery) {
                routePeakLoad.put(bestRoute, routePeakLoad.get(bestRoute) + addedWeight);
            } else {
                double newEndLoad = routeEndLoad.get(bestRoute) + addedWeight;
                routeEndLoad.put(bestRoute, newEndLoad);
                routePeakLoad.put(bestRoute, Math.max(routePeakLoad.get(bestRoute), newEndLoad));
            }

            int sequence = courierSequences.get(bestRoute);
            bestStop.route = bestRoute;
            bestStop.stopSequence = sequence;
            bestRoute.stops.add(bestStop);

            courierSequences.put(bestRoute, sequence + 1);
            currentCourierLocations.put(bestRoute, DailyRouteScheduler.getTargetLocation(bestStop.order));
            unassignedStops.remove(bestStop);
        }

        return problem;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.GREEDY_SIMPLE;
    }
}