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

        RoutePlan solution = new RoutePlan();
        solution.routes = new ArrayList<>();
        solution.stops = new ArrayList<>();

        for (Route origRoute : problem.routes) {
            Route clonedRoute = new Route();
            clonedRoute.id = origRoute.id;
            clonedRoute.maxCargoCapacity = origRoute.maxCargoCapacity != null ? origRoute.maxCargoCapacity : 1000.0;
            clonedRoute.stops = new ArrayList<>();
            solution.routes.add(clonedRoute);
        }

        List<RouteStop> unassignedStops = new ArrayList<>();
        for (RouteStop origStop : problem.stops) {
            RouteStop clonedStop = new RouteStop();
            clonedStop.id = origStop.id;
            clonedStop.order = origStop.order;
            solution.stops.add(clonedStop);
            unassignedStops.add(clonedStop);
        }

        Map<Route, Location> currentCourierLocations = new HashMap<>();
        Map<Route, Integer> courierSequences = new HashMap<>();
        Map<Route, Double> routePeakLoad = new HashMap<>();
        Map<Route, Double> routeEndLoad = new HashMap<>();

        Location depot = DailyRouteScheduler.createDepotLocation();

        for (Route cr : solution.routes) {
            currentCourierLocations.put(cr, depot);
            courierSequences.put(cr, 0);
            routePeakLoad.put(cr, 0.0);
            routeEndLoad.put(cr, 0.0);
        }

        while (!unassignedStops.isEmpty()) {
            Route bestRoute = null;
            RouteStop bestStop = null;
            double minDistance = Double.MAX_VALUE;

            for (Route candidateRoute : solution.routes) {
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

                    if (isDelivery) {
                        predictedPeak += orderWeight;
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
                bestRoute = solution.routes.getFirst();
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

        return solution;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.GREEDY_SIMPLE;
    }
}