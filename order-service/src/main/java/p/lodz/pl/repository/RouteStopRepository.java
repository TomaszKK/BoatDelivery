package p.lodz.pl.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.RouteStop;

import java.util.UUID;

@ApplicationScoped
public class RouteStopRepository implements PanacheRepositoryBase<RouteStop, UUID> {
}