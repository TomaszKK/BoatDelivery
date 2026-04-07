package pl.dmcs.userservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "transports")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transport extends ControlledEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id", nullable = false)
    @JsonBackReference
    private User courier;

    @Enumerated(EnumType.STRING)
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

