package p.lodz.pl.model;

import ai.timefold.solver.core.api.score.buildin.hardsoft.HardSoftScore;
import ai.timefold.solver.core.api.score.stream.Constraint;
import ai.timefold.solver.core.api.score.stream.ConstraintFactory;
import ai.timefold.solver.core.api.score.stream.ConstraintProvider;
import p.lodz.pl.service.DailyRouteScheduler;
import p.lodz.pl.util.Util;

import java.util.List;

public class RouteConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory factory) {
        return new Constraint[]{
                minimizeTotalDistance(factory),
                vehicleCapacity(factory),
                balanceCourierLoad(factory)
        };
    }

    private Constraint minimizeTotalDistance(ConstraintFactory factory) {
        return factory.forEach(Route.class)
                .filter(route -> route.stops != null && !route.stops.isEmpty())
                .penalize(HardSoftScore.ONE_SOFT, this::calculateDistanceForRoute)
                .asConstraint("Minimize Total Distance");
    }

    private Constraint vehicleCapacity(ConstraintFactory factory) {
        return factory.forEach(Route.class)
                .filter(route -> route.stops != null && route.maxCargoCapacity != null)
                .filter(route -> {
                    double currentLoad = 0.0;

                    for (RouteStop stop : route.stops) {
                        if (stop.order != null && stop.order.weight != null) {
                            if (DailyRouteScheduler.isDelivery(stop.order)) {
                                currentLoad += stop.order.weight.doubleValue();
                            }
                        }
                    }

                    double peakLoad = currentLoad;

                    for (RouteStop stop : route.stops) {
                        if (stop.order != null && stop.order.weight != null) {
                            double weight = stop.order.weight.doubleValue();

                            if (DailyRouteScheduler.isDelivery(stop.order)) {
                                currentLoad -= weight;
                            } else {
                                currentLoad += weight;
                                if (currentLoad > peakLoad) {
                                    peakLoad = currentLoad;
                                }
                            }
                        }
                    }
                    return peakLoad > route.maxCargoCapacity;
                })
                .penalize(HardSoftScore.ONE_HARD)
                .asConstraint("Vehicle Capacity Exceeded");
    }

    private int calculateDistanceForRoute(Route route) {
        int totalDistance = 0;
        List<RouteStop> stops = route.stops;
        if (stops == null || stops.isEmpty()) return 0;

        Location depot = DailyRouteScheduler.createDepotLocation();

        Location firstLoc = DailyRouteScheduler.getTargetLocation(stops.getFirst().order);
        if (firstLoc != null) {
            totalDistance += Util.calculateDistance(depot, firstLoc);
        }

        for (int i = 0; i < stops.size() - 1; i++) {
            if (stops.get(i).order != null && stops.get(i + 1).order != null) {
                Location loc1 = DailyRouteScheduler.getTargetLocation(stops.get(i).order);
                Location loc2 = DailyRouteScheduler.getTargetLocation(stops.get(i + 1).order);

                if (loc1 != null && loc2 != null) {
                    totalDistance += Util.calculateDistance(loc1, loc2);
                }
            }
        }

        Location lastLoc = DailyRouteScheduler.getTargetLocation(stops.getLast().order);
        if (lastLoc != null) {
            totalDistance += Util.calculateDistance(lastLoc, depot);
        }

        return totalDistance;
    }

    private Constraint balanceCourierLoad(ConstraintFactory factory) {
        return factory.forEach(Route.class)
                .filter(route -> route.stops != null && !route.stops.isEmpty())
                .penalize(HardSoftScore.ofSoft(10000), route -> route.stops.size() * route.stops.size())
                .asConstraint("Balance Courier Load");
    }
}