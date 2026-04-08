package p.lodz.pl.dto;

public record LocationRequestDTO(
        String streetAddress,
        String postalCode,
        String city,
        String country
) {}
