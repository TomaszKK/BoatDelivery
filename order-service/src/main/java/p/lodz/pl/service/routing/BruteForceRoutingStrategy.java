package p.lodz.pl.service.routing;

import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.exception.BadRequestException;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.RoutePlan;
import p.lodz.pl.util.Util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@ApplicationScoped
public class BruteForceRoutingStrategy implements RoutingStrategy {

    private List<RouteStop> bestRouteStops;
    private int minTotalDistance;

    @Override
    public RoutePlan solve(RoutePlan problem) {
        if (problem.routes == null || problem.routes.isEmpty() || problem.stops == null || problem.stops.isEmpty()) {
            return problem;
        }

        if (problem.stops.size() > 10) {
            throw new BadRequestException("Maximum number of stops exceeded");
        }

        bestRouteStops = null;
        minTotalDistance = Integer.MAX_VALUE;

        generatePermutations(new ArrayList<>(problem.stops), 0);

        Route route = problem.routes.getFirst();
        for (int i = 0; i < bestRouteStops.size(); i++) {
            RouteStop stop = bestRouteStops.get(i);
            stop.route = route;
            stop.stopSequence = i;
        }
        route.stops = bestRouteStops;

        return problem;
    }

    private void generatePermutations(List<RouteStop> arr, int k) {
        if (k == arr.size()) {
            int currentDistance = calculateTotalDistance(arr);
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

    private int calculateTotalDistance(List<RouteStop> stops) {
        int distance = 0;
        for (int i = 0; i < stops.size() - 1; i++) {
            distance += Util.calculateDistance(
                    stops.get(i).order.deliveryLocation,
                    stops.get(i + 1).order.deliveryLocation
            );
        }
        return distance;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.BRUTE_FORCE;
    }
}