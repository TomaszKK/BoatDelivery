package p.lodz.pl.dto.maps;

public record HereAddress(
        String street,
        String city,
        String postalCode,
        String countryCode,
        String houseNumber
) {}
