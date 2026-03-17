package p.lodz.pl.model;

import jakarta.persistence.*;
import p.lodz.pl.model.enums.RouteStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "routes")
public class Route extends ControlledEntity {

    @Column(name = "driver_id")
    public UUID driverId;

    @Column(name = "vehicle_id")
    public UUID vehicleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public RouteStatus status = RouteStatus.PENDING;

    @Column(name = "total_distance_km")
    public BigDecimal totalDistanceKm;

    @Column(name = "estimated_duration_min")
    public Integer estimatedDurationMin;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<RouteStop> stops = new ArrayList<>();
}