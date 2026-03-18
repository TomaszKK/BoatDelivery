package pl.dmcs.userservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.*;
import pl.dmcs.userservice.model.TransportType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransportRequest {

    @NotNull(message = "Typ transportu nie może być pusty")
    private TransportType transportType;

    @NotBlank(message = "Marka pojazdu nie może być pusta")
    private String brand;

    @NotBlank(message = "Model pojazdu nie może być pusty")
    private String model;

    @NotBlank(message = "Typ paliwa nie może być pusty")
    private String fuelType;

    @NotNull(message = "Objętość bagażnika nie może być pusta")
    @Positive(message = "Objętość bagażnika musi być większa od 0")
    private Double trunkVolume;

    @NotNull(message = "Pojemność ładunku nie może być pusta")
    @Positive(message = "Pojemność ładunku musi być większa od 0")
    private Double cargoCapacity;

    @NotNull(message = "Spalanie nie może być puste")
    @Positive(message = "Spalanie musi być większe od 0")
    private Double consumption;

    @NotBlank(message = "Numer rejestracyjny nie może być pusty")
    private String licensePlate;

    private String color;
}

