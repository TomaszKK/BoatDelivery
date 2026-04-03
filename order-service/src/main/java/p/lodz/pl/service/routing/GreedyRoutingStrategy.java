package p.lodz.pl.service.routing;

import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.RoutePlan;
import p.lodz.pl.util.Util;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class GreedyRoutingStrategy implements RoutingStrategy {

    @Override
    public RoutePlan solve(RoutePlan problem) {
        if (problem.routes == null || problem.routes.isEmpty() || problem.stops == null || problem.stops.isEmpty()) {
            return problem;
        }

        Route route = problem.routes.getFirst();
        List<RouteStop> unassignedStops = new ArrayList<>(problem.stops);
        List<RouteStop> optimizedStops = new ArrayList<>();

        RouteStop currentStop = unassignedStops.removeFirst();
        assignStopToRoute(currentStop, route, 0);
        optimizedStops.add(currentStop);

        int sequence = 1;

        while (!unassignedStops.isEmpty()) {
            RouteStop nearestStop = null;
            int minDistance = Integer.MAX_VALUE;

            for (RouteStop candidate : unassignedStops) {
                int distance = Util.calculateDistance(
                        currentStop.order.deliveryLocation,
                        candidate.order.deliveryLocation
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestStop = candidate;
                }
            }

            assert nearestStop != null;
            assignStopToRoute(nearestStop, route, sequence++);
            optimizedStops.add(nearestStop);
            unassignedStops.remove(nearestStop);

            currentStop = nearestStop;
        }

        route.stops = optimizedStops;
        return problem;
    }

    private void assignStopToRoute(RouteStop stop, Route route, int sequence) {
        stop.route = route;
        stop.stopSequence = sequence;
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.GREEDY_SIMPLE;
    }
}