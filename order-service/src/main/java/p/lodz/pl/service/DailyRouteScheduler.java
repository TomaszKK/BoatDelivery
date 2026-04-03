package p.lodz.pl.service;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.jboss.logging.Logger;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.AlgorithmType;
import p.lodz.pl.model.enums.RouteStatus;
import p.lodz.pl.model.solver.RoutePlan;
import p.lodz.pl.repository.RouteRepository;
import p.lodz.pl.repository.RouteStopRepository;

import java.util.List;

@ApplicationScoped
public class DailyRouteScheduler {

    private static final Logger LOG = Logger.getLogger(DailyRouteScheduler.class);

    @Inject
    RouteOptimizationService routeOptimizationService;

    @Inject
    AlgorithmSettingsService settingsService;

    @Inject
    RouteRepository routeRepository;

    @Inject
    RouteStopRepository routeStopRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void optimizeMidnightRoutes() {
        LOG.info("Starting optimizeMidnightRoutes");
        executeOptimization();
    }

    @Transactional
    public void forceImmediateOptimization() {
        LOG.info("Force immediate optimization triggered");
        executeOptimization();
    }

    private void executeOptimization() {
        AlgorithmType currentAlgo = settingsService.getCurrentAlgorithm();

        List<Route> routes = routeRepository.list("status", RouteStatus.PENDING);

        List<RouteStop> stops = routeStopRepository.list("route.status", RouteStatus.PENDING);

        if (routes.isEmpty() || stops.isEmpty()) {
            LOG.info("No routes or stops found");
            return;
        }

        LOG.infof("From database: Found %d routes and %d stops for optimization", routes.size(), stops.size());

        RoutePlan problem = new RoutePlan(routes, stops);

        try {
            routeOptimizationService.optimizeRoutes(problem, currentAlgo);
            LOG.infof("Optimized routes with algorithm %s", currentAlgo);

        } catch (Exception e) {
            LOG.error("There was an error while optimizing routes", e);
        }
    }
}