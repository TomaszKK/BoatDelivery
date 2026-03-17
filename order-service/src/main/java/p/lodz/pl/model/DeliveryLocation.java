package p.lodz.pl.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "delivery_locations")
public class DeliveryLocation extends ControlledEntity {

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    public Order order;

    @Column(nullable = false, precision = 10, scale = 7)
    public BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    public BigDecimal longitude;

    @Column(name = "address_line")
    public String addressLine;
}