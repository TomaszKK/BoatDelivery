package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import p.lodz.pl.dto.RouteResponseDTO;
import p.lodz.pl.mapper.RouteMapper;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.model.enums.RouteStatus;
import p.lodz.pl.repository.RouteRepository;
import p.lodz.pl.repository.RouteStopRepository;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class RouteService {

    @Inject
    RouteRepository routeRepository;

    @Inject
    RouteStopRepository routeStopRepository;

    @Inject
    RouteMapper routeMapper;

    @Transactional
    public List<RouteResponseDTO> getAllRoutes(String userId, boolean isAdmin) {
        List<Route> routes;

        // Ograniczenie widoczności na podstawie roli
        if (isAdmin) {
            routes = routeRepository.listAll();
        } else {
            routes = routeRepository.list("courierId", UUID.fromString(userId));
        }

        // Posortowanie przystanków
        for (Route route : routes) {
            if (route.stops != null) {
                route.stops.sort(Comparator.comparingInt(s -> s.stopSequence != null ? s.stopSequence : 0));
            }
        }

        return routes.stream()
                .map(routeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void startRoute(UUID routeId, String courierId) {
        Route route = routeRepository.findById(routeId);
        if (route == null) {
            throw new IllegalArgumentException("Nie znaleziono trasy o podanym ID");
        }

        if (!route.courierId.toString().equals(courierId)) {
            throw new SecurityException("Nie masz uprawnień do rozpoczęcia tej trasy!");
        }

        if (route.status != RouteStatus.PENDING) {
            throw new IllegalStateException("Trasę można rozpocząć tylko ze statusu PENDING");
        }

        route.status = RouteStatus.IN_PROGRESS;

        // Zmieniamy status paczek na "W Drodze", gdy kurier odjeżdża z bazy
        if (route.stops != null) {
            for (RouteStop stop : route.stops) {
                if (stop.order.status == OrderStatus.ROUTE_ASSIGNED_RECEIVE) {
                    stop.order.status = OrderStatus.IN_TRANSIT_FOR_PACKAGE;
                } else if (stop.order.status == OrderStatus.ROUTE_ASSIGNED_DELIVERY) {
                    stop.order.status = OrderStatus.IN_TRANSIT_TO_CUSTOMER;
                }
            }
        }
    }

    @Transactional
    public void markStopAsCompleted(UUID stopId, String courierId) {
        RouteStop stop = routeStopRepository.findById(stopId);
        if (stop == null) {
            throw new IllegalArgumentException("Nie znaleziono przystanku");
        }

        Route parentRoute = stop.route;
        if (!parentRoute.courierId.toString().equals(courierId)) {
            throw new SecurityException("Przystanek nie należy do Twojej trasy!");
        }

        if (parentRoute.status != RouteStatus.IN_PROGRESS) {
            throw new IllegalStateException("Musisz najpierw rozpocząć trasę (IN_PROGRESS)!");
        }

        // Aktualizujemy zamówienie po przybyciu kuriera
        if (stop.order.status == OrderStatus.IN_TRANSIT_FOR_PACKAGE) {
            stop.order.status = OrderStatus.ORDER_RECEIVED_FROM_CUSTOMER;
        } else if (stop.order.status == OrderStatus.IN_TRANSIT_TO_CUSTOMER) {
            stop.order.status = OrderStatus.DELIVERY_COMPLETED;
        }

        // ZAWIESILIŚMY AUTOMATYCZNE ZAMYKANIE TRASY TUTAJ!
        // Kurier musi świadomie kliknąć "Zakończ zmianę", by zrzucić statusy do Sortowni.
    }

    @Transactional
    public void finishRoute(UUID routeId, String courierId) {
        Route route = routeRepository.findById(routeId);
        if (route == null) {
            throw new IllegalArgumentException("Nie znaleziono trasy");
        }

        if (!route.courierId.toString().equals(courierId)) {
            throw new SecurityException("Nie masz uprawnień do tej trasy!");
        }

        if (route.status != RouteStatus.IN_PROGRESS) {
            throw new IllegalStateException("Trasa musi być w trakcie realizacji (IN_PROGRESS), aby ją zakończyć!");
        }

        // Zabezpieczenie: Sprawdzamy, czy wszystkie paczki są obsłużone (żadna nie jest IN_TRANSIT)
        if (route.stops != null) {
            boolean hasUnfinishedStops = route.stops.stream()
                    .anyMatch(stop -> stop.order.status == OrderStatus.IN_TRANSIT_FOR_PACKAGE
                            || stop.order.status == OrderStatus.IN_TRANSIT_TO_CUSTOMER);

            if (hasUnfinishedStops) {
                throw new IllegalStateException("Nie możesz zakończyć zmiany! Masz wciąż nieobsłużone paczki na trasie.");
            }
        }

        // 1. Zamykamy trasę
        route.status = RouteStatus.COMPLETED;

        // 2. Oddajemy zebrane paczki do sortowni
        if (route.stops != null) {
            for (RouteStop stop : route.stops) {
                if (stop.order != null) {
                    if (stop.order.status == OrderStatus.ORDER_RECEIVED_FROM_CUSTOMER) {
                        stop.order.status = OrderStatus.IN_SORTING_CENTER;
                    }
                }
            }
        }
    }
}