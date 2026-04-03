package p.lodz.pl.service.routing;

import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.RoutePlan;

import java.util.concurrent.ExecutionException;

public interface RoutingStrategy {
    RoutePlan solve(RoutePlan problem) throws ExecutionException, InterruptedException;

    AlgorithmType getType();
}