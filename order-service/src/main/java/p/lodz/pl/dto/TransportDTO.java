package p.lodz.pl.dto;

import java.util.UUID;

public record TransportDTO(
        UUID id,
        UUID courierId,
        String transportType,
        String brand,
        String model,
        String fuelType,
        Double trunkVolume,
        Double cargoCapacity,
        Double consumption,
        String licensePlate,
        String color
) {}