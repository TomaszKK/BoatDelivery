package p.lodz.pl.model;

import jakarta.persistence.*;
import p.lodz.pl.model.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order extends ControlledEntity {

    @Column(name = "tracking_number", unique = true, nullable = false, updatable = false, length = 15)
    public String trackingNumber;

    @Column(name = "customer_id", nullable = false)
    public UUID customerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public OrderStatus status = OrderStatus.ORDER_CREATED;

    public BigDecimal weight;
    public BigDecimal volume;

    @Column(name = "time_window_start")
    public Instant timeWindowStart;

    @Column(name = "time_window_end")
    public Instant timeWindowEnd;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pickup_location_id", referencedColumnName = "id")
    public Location pickupLocation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_location_id", referencedColumnName = "id")
    public Location deliveryLocation;

}