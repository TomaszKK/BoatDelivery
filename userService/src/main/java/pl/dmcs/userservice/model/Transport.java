package pl.dmcs.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transports")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id", nullable = false)
    private User courier;

    @Column(nullable = false)
    private TransportType transportType;

    private String brand;
    private String model;

    private String fuelType;

    private Double trunkVolume;
    private Double cargoCapacity;

    private Double consumption;

    private String licensePlate;
    private String color;
}

