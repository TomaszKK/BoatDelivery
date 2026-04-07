package p.lodz.pl.model;

import ai.timefold.solver.core.api.domain.entity.PlanningEntity;
import ai.timefold.solver.core.api.domain.variable.PlanningListVariable;
import jakarta.persistence.*;
import p.lodz.pl.model.enums.RouteStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "routes")
@PlanningEntity
public class Route extends ControlledEntity {

    @Column(name = "courier_id")
    public UUID courierId;

    @Column(name = "transport_id")
    public UUID transportId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public RouteStatus status = RouteStatus.PENDING;

    @Column(name = "total_distance_km")
    public BigDecimal totalDistanceKm;

    @Column(name = "estimated_duration_min")
    public Integer estimatedDurationMin;

    @PlanningListVariable(valueRangeProviderRefs = "stopRange")
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<RouteStop> stops = new ArrayList<>();
}