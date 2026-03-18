package p.lodz.pl.model;

import jakarta.persistence.*;
import p.lodz.pl.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order extends ControlledEntity {

    @Column(name = "customer_id", nullable = false)
    public UUID customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public OrderStatus status = OrderStatus.NEW;

    public BigDecimal weight;
    public BigDecimal volume;

    @Column(name = "time_window_start")
    public Instant timeWindowStart;

    @Column(name = "time_window_end")
    public Instant timeWindowEnd;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    public DeliveryLocation deliveryLocation;
}