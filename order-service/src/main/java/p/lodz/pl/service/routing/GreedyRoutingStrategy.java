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
import java.util.Comparator;
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
            clonedRoute.maxCargoCapacity = origRoute.maxCargoCapacity != null ? origRoute.maxCargoCapacity : 0.0;
            clonedRoute.stops = new ArrayList<>();
            solution.routes.add(clonedRoute);
        }

        List<RouteStop> unassignedStops = new ArrayList<>();
        for (RouteStop origStop : problem.stops) {
            RouteStop clonedStop = new RouteStop();
            clonedStop.id = origStop.id;
            clonedStop.order = origStop.order;
            unassignedStops.add(clonedStop);
        }

        Map<Route, Location> currentCourierLocations = new HashMap<>();
        Map<Route, Integer> courierSequences = new HashMap<>();
        Map<Route, Double> routePeakLoad = new HashMap<>();
        Map<Route, Double> routeEndLoad = new HashMap<>();

        // NOWE: Śledzenie czasu i dystansu
        Map<Route, Double> routeDistance = new HashMap<>();
        Map<Route, Integer> routeStopsCount = new HashMap<>();

        Location depot = DailyRouteScheduler.createDepotLocation();

        for (Route cr : solution.routes) {
            currentCourierLocations.put(cr, depot);
            courierSequences.put(cr, 0);
            routePeakLoad.put(cr, 0.0);
            routeEndLoad.put(cr, 0.0);
            routeDistance.put(cr, 0.0);
            routeStopsCount.put(cr, 0);
        }

        while (!unassignedStops.isEmpty()) {
            Route bestRoute = null;
            RouteStop bestStop = null;
            double minDistance = Double.MAX_VALUE;

            for (Route candidateRoute : solution.routes) {
                double maxCapacity = candidateRoute.maxCargoCapacity;

                if (maxCapacity <= 0) {
                    continue;
                }

                Location currentLoc = currentCourierLocations.get(candidateRoute);

                for (RouteStop candidateStop : unassignedStops) {
                    double orderWeight = candidateStop.order != null && candidateStop.order.weight != null
                            ? candidateStop.order.weight.doubleValue() : 0.0;

                    boolean isDelivery = DailyRouteScheduler.isDelivery(candidateStop.order);
                    double predictedPeak = routePeakLoad.get(candidateRoute);
                    double predictedEnd = routeEndLoad.get(candidateRoute);

                    if (isDelivery) {
                        predictedPeak += orderWeight;
                    } else {
                        predictedEnd += orderWeight;
                        predictedPeak = Math.max(predictedPeak, predictedEnd);
                    }

                    // SPRAWDZENIE 1: Ładowność
                    if (predictedPeak > maxCapacity) {
                        continue;
                    }

                    Location candidateLoc = DailyRouteScheduler.getTargetLocation(candidateStop.order);
                    double distance = 0.0;
                    if (currentLoc != null && candidateLoc != null) {
                        distance = Util.calculateDistance(currentLoc, candidateLoc);
                    }

                    // SPRAWDZENIE 2: Czas pracy (Max 8h = 480 minut)
                    double distanceToDepot = candidateLoc != null ? Util.calculateDistance(candidateLoc, depot) : 0;
                    double projectedDistance = routeDistance.get(candidateRoute) + distance + distanceToDepot;
                    int projectedStops = routeStopsCount.get(candidateRoute) + 1;

                    // Szacowanie czasu: (dystans(km) * 2 min) + (paczki * 10 min)
                    double projectedTimeMinutes = (projectedDistance / 1000.0) * 2.0 + (projectedStops * 10);

                    if (projectedTimeMinutes > 480.0) {
                        continue; // Trasa potrwa za długo, pomijamy!
                    }

                    if (distance < minDistance) {
                        minDistance = distance;
                        bestRoute = candidateRoute;
                        bestStop = candidateStop;
                    }
                }
            }

            // OSTATECZNE ZABEZPIECZENIE: Brak dostępnych kurierów (brak czasu lub miejsca)
            if (bestStop == null || bestRoute == null) {
                break; // PRZERYWAMY PĘTLĘ! Pozostałe paczki nie dostaną przypisania
            }

            double addedWeight = bestStop.order != null && bestStop.order.weight != null
                    ? bestStop.order.weight.doubleValue() : 0.0;
            boolean isDelivery = DailyRouteScheduler.isDelivery(bestStop.order);

            if (isDelivery) {
                routePeakLoad.put(bestRoute, routePeakLoad.get(bestRoute) + addedWeight);
            } else {
                double newEndLoad = routeEndLoad.get(bestRoute) + addedWeight;
                routeEndLoad.put(bestRoute, newEndLoad);
                routePeakLoad.put(bestRoute, Math.max(routePeakLoad.get(bestRoute), newEndLoad));
            }

            // Aktualizacja dystansu i liczników trasy
            Location bestCurrentLoc = currentCourierLocations.get(bestRoute);
            Location bestTargetLoc = DailyRouteScheduler.getTargetLocation(bestStop.order);
            double addedDistance = (bestCurrentLoc != null && bestTargetLoc != null)
                    ? Util.calculateDistance(bestCurrentLoc, bestTargetLoc) : 0.0;

            routeDistance.put(bestRoute, routeDistance.get(bestRoute) + addedDistance);
            routeStopsCount.put(bestRoute, routeStopsCount.get(bestRoute) + 1);

            int sequence = courierSequences.get(bestRoute);
            bestStop.route = bestRoute;
            bestStop.stopSequence = sequence;
            bestRoute.stops.add(bestStop);

            // Dodajemy pomyślnie przypisaną paczkę do wyniku
            solution.stops.add(bestStop);

            courierSequences.put(bestRoute, sequence + 1);
            currentCourierLocations.put(bestRoute, bestTargetLoc);
            unassignedStops.remove(bestStop);
        }

        return solution;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.GREEDY_SIMPLE;
    }
}