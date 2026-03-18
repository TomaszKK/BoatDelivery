package p.lodz.pl.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "route_stops")
public class RouteStop extends ControlledEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    public Route route;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    public Order order;

    @Column(name = "stop_sequence", nullable = false)
    public Integer stopSequence;

    @Column(name = "estimated_arrival_time")
    public Instant estimatedArrivalTime;
}