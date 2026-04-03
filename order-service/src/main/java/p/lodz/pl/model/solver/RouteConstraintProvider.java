package p.lodz.pl.model.solver;

import ai.timefold.solver.core.api.score.buildin.hardsoft.HardSoftScore;
import ai.timefold.solver.core.api.score.stream.Constraint;
import ai.timefold.solver.core.api.score.stream.ConstraintFactory;
import ai.timefold.solver.core.api.score.stream.ConstraintProvider;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.util.Util;

import java.util.List;

public class RouteConstraintProvider implements ConstraintProvider {

    @Override
    public Constraint[] defineConstraints(ConstraintFactory factory) {
        return new Constraint[]{
                minimizeTotalDistance(factory),
                // TODO more constraints
        };
    }

    private Constraint minimizeTotalDistance(ConstraintFactory factory) {
        return factory.forEach(Route.class)
                .filter(route -> !route.stops.isEmpty())
                .penalize(HardSoftScore.ONE_SOFT, this::calculateDistanceForRoute)
                .asConstraint("Minimize Total Distance");
    }

    private int calculateDistanceForRoute(Route route) {
        int totalDistance = 0;
        List<RouteStop> stops = route.stops;
        if (stops == null || stops.size() < 2) return 0;

        for (int i = 0; i < stops.size() - 1; i++) {
            Location loc1 = stops.get(i).order.deliveryLocation;
            Location loc2 = stops.get(i + 1).order.deliveryLocation;
            totalDistance += Util.calculateDistance(loc1, loc2);
        }
        return totalDistance;
    }
}