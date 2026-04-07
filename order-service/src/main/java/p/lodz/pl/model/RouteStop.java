package p.lodz.pl.model;

import ai.timefold.solver.core.api.domain.entity.PlanningEntity;
import ai.timefold.solver.core.api.domain.variable.InverseRelationShadowVariable;
import jakarta.persistence.*;
import org.hibernate.annotations.SoftDelete;

import java.time.Instant;

@Entity
@Table(name = "route_stops")
@PlanningEntity
@SoftDelete
public class RouteStop extends ControlledEntity {

    @InverseRelationShadowVariable(sourceVariableName = "stops")
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