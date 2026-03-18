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

    @Column(name = "street_address", nullable = false)
    public String streetAddress;

    @Column(name = "postal_code", nullable = false, length = 10)
    public String postalCode;

    @Column(name = "city", nullable = false)
    public String city;

    @Column(name = "country", nullable = false)
    public String country = "Polska";
}