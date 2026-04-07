package p.lodz.pl.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.Route;

import java.util.UUID;

@ApplicationScoped
public class RouteRepository implements PanacheRepositoryBase<Route, UUID> {
}