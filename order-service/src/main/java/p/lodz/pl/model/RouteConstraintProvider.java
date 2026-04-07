package p.lodz.pl.model;

import ai.timefold.solver.core.api.score.buildin.hardsoft.HardSoftScore;
import ai.timefold.solver.core.api.score.stream.Constraint;
import ai.timefold.solver.core.api.score.stream.ConstraintFactory;
import ai.timefold.solver.core.api.score.stream.ConstraintProvider;
import p.lodz.pl.model.enums.OrderStatus;
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
                    double peakLoad = 0.0;
                    double endLoad = 0.0;

                    for (RouteStop stop : route.stops) {
                        if (stop.order != null && stop.order.weight != null) {
                            double weight = stop.order.weight.doubleValue();
                            boolean isDelivery = stop.order.status == OrderStatus.IN_SORTING_CENTER;

                            if (isDelivery) {
                                peakLoad += weight;
                            } else {
                                endLoad += weight;
                                peakLoad = Math.max(peakLoad, endLoad);
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
        if (stops == null || stops.size() < 2) return 0;

        for (int i = 0; i < stops.size() - 1; i++) {
            if (stops.get(i).order != null && stops.get(i + 1).order != null) {
                Location loc1 = getTargetLocation(stops.get(i).order);
                Location loc2 = getTargetLocation(stops.get(i + 1).order);

                if (loc1 != null && loc2 != null) {
                    totalDistance += Util.calculateDistance(loc1, loc2);
                }
            }
        }
        return totalDistance;
    }

    private Location getTargetLocation(Order order) {
        if (order == null) return null;
        if (order.status == OrderStatus.CALCULATING_ROUTE_RECEIVE || order.status == OrderStatus.ROUTE_ASSIGNED_RECEIVE) {
            return order.pickupLocation;
        }
        return order.deliveryLocation;
    }

    private Constraint balanceCourierLoad(ConstraintFactory factory) {
        return factory.forEach(Route.class)
                .filter(route -> route.stops != null && !route.stops.isEmpty())
                .penalize(HardSoftScore.ofSoft(10000), route -> route.stops.size() * route.stops.size())
                .asConstraint("Balance Courier Load");
    }
}