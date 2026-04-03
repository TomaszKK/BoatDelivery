package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Instance;
import jakarta.inject.Inject;
import p.lodz.pl.exception.BadRequestException;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.RoutePlan;
import p.lodz.pl.service.routing.RoutingStrategy;

import java.util.concurrent.ExecutionException;

@ApplicationScoped
public class RouteOptimizationService {

    @Inject
    Instance<RoutingStrategy> strategies;

    public RoutePlan optimizeRoutes(RoutePlan problem, AlgorithmType chosenAlgorithm) throws ExecutionException, InterruptedException {
        RoutingStrategy strategyToUse = strategies.stream()
                .filter(s -> s.getType() == chosenAlgorithm)
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Illegal algorithm: " + chosenAlgorithm));

        return strategyToUse.solve(problem);
    }
}