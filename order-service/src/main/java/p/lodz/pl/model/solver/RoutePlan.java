package p.lodz.pl.model.solver;

import ai.timefold.solver.core.api.domain.solution.PlanningEntityCollectionProperty;
import ai.timefold.solver.core.api.domain.solution.PlanningScore;
import ai.timefold.solver.core.api.domain.solution.PlanningSolution;
import ai.timefold.solver.core.api.domain.solution.ProblemFactCollectionProperty;
import ai.timefold.solver.core.api.domain.valuerange.ValueRangeProvider;
import ai.timefold.solver.core.api.score.buildin.hardsoft.HardSoftScore;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;

import java.util.List;

@PlanningSolution
public class RoutePlan {

    @PlanningEntityCollectionProperty
    public List<Route> routes;

    @ValueRangeProvider(id = "stopRange")
    @ProblemFactCollectionProperty
    public List<RouteStop> stops;

    @PlanningScore
    public HardSoftScore score;

    public RoutePlan() {}

    public RoutePlan(List<Route> routes, List<RouteStop> stops) {
        this.routes = routes;
        this.stops = stops;
    }
}