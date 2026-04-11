package pl.dmcs.userservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import pl.dmcs.userservice.model.TransportType;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransportResponse {
    private UUID id;
    private CourierDTO courier;
    private TransportType transportType;
    private String brand;
    private String model;
    private String fuelType;
    private Double trunkVolume;
    private Double cargoCapacity;
    private Double consumption;
    private String licensePlate;
    private String color;

    // Nested DTO dla kuriera bez transportów
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourierDTO {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
    }
}

