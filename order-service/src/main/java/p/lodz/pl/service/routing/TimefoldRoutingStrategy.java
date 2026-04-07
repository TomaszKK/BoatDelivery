package p.lodz.pl.service.routing;

import ai.timefold.solver.core.api.solver.SolverManager;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.RoutePlan;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@ApplicationScoped
public class TimefoldRoutingStrategy implements RoutingStrategy {

    @Inject
    SolverManager<RoutePlan, UUID> solverManager;

    @Override
    public RoutePlan solve(RoutePlan problem) {
        UUID problemId = UUID.randomUUID();
        try {
            return solverManager.solve(problemId, problem).getFinalBestSolution();
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Timefold solver crashed", e);
        }
    }

    @Override
    public AlgorithmType getType() {
        return AlgorithmType.TIMEFOLD_ADVANCED;
    }
}