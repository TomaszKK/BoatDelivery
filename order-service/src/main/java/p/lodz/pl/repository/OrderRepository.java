package p.lodz.pl.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import p.lodz.pl.model.Order;

@ApplicationScoped
public class OrderRepository implements PanacheRepository<Order> {
}
