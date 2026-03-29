package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;
import p.lodz.pl.controller.GoogleMapsClient;
import p.lodz.pl.controller.HereGeocodeClient;
import p.lodz.pl.dto.maps.DirectionsApiResponse;
import p.lodz.pl.dto.maps.HereAddress;
import p.lodz.pl.dto.maps.HereGeocodeResponse;
import p.lodz.pl.dto.maps.HerePosition;
import p.lodz.pl.model.Location;

@ApplicationScoped
public class LocationService {

    @Inject
    @RestClient
    GoogleMapsClient googleMapsClient;

    @Inject
    @RestClient
    HereGeocodeClient hereGeocodeClient;

    @ConfigProperty(name = "google.api.key")
    String googleApiKey;

    @ConfigProperty(name = "here.api.key")
    String hereApiKey;

    private static final Logger LOG = Logger.getLogger(LocationService.class);

    public Double calculateDistance(String originAddress, String destinationAddress) {
        DirectionsApiResponse response = googleMapsClient.getDirections(originAddress, destinationAddress, googleApiKey);

        if (response != null && response.routes() != null && !response.routes().isEmpty()) {
            return response.routes().getFirst().legs().getFirst().distance().value() / 1000.0;
        }
        return (double) Integer.MAX_VALUE;
    }

    public String formatAddress(Location address) {
        return String.format("%s, %s %s, %s",
                address.streetAddress,
                address.postalCode,
                address.city,
                address.country);
    }

    public HerePosition getCoordinatesIfValid(String street, String city, String postalCode, String countryCode) {
        String query = String.format("%s, %s, %s, %s", street, postalCode, city, countryCode);

        // LOG 1: What exact string are we sending to HERE API?
        LOG.infof("Sending query to HERE API: [%s]", query);

        HereGeocodeResponse response = hereGeocodeClient.getGeocode(query, hereApiKey);

        if (response == null || response.items() == null || response.items().isEmpty()) {
            LOG.warn("HERE API returned an empty response. Cannot find the address.");
            return null;
        }

        HereAddress returnedAddress = response.items().getFirst().address();

        // LOG 2: What did HERE API actually return?
        LOG.infof("HERE API returned address: %s", returnedAddress);

        String returnedStreet = returnedAddress.street() != null ? returnedAddress.street() : "";
        String returnedHouseNumber = returnedAddress.houseNumber() != null ? returnedAddress.houseNumber() : "";

        String normalizedStreet = street.replaceAll("(?i)^ulica\\s+", "").trim();
        String normalizedReturnedStreet = returnedStreet.replaceAll("(?i)^ulica\\s+", "").trim();

        boolean isCityValid = city.equalsIgnoreCase(returnedAddress.city());
        boolean isCountryValid = countryCode.equalsIgnoreCase(returnedAddress.countryCode());
        boolean isPostalCodeValid = postalCode.equalsIgnoreCase(returnedAddress.postalCode());

        String calculatedStreetToCompare = (normalizedReturnedStreet + " " + returnedHouseNumber).trim();
        boolean isStreetValid = normalizedStreet.equalsIgnoreCase(calculatedStreetToCompare);
        boolean isHouseNumberValid = returnedAddress.houseNumber() == null || street.contains(returnedAddress.houseNumber());

        // LOG 3: The Moment of Truth - Print every single validation flag and the strings being compared
        LOG.infof("Validation details:\n" +
                        "  - City Valid: %b | Input: [%s] vs Returned: [%s]\n" +
                        "  - Country Valid: %b | Input: [%s] vs Returned: [%s]\n" +
                        "  - Postal Valid: %b | Input: [%s] vs Returned: [%s]\n" +
                        "  - Street Valid: %b | Input: [%s] vs Returned: [%s]\n" +
                        "  - House Number Valid: %b",
                isCityValid, city, returnedAddress.city(),
                isCountryValid, countryCode, returnedAddress.countryCode(),
                isPostalCodeValid, postalCode, returnedAddress.postalCode(),
                isStreetValid, normalizedStreet, calculatedStreetToCompare,
                isHouseNumberValid);

        boolean isValid = isCityValid && isCountryValid && isPostalCodeValid && isStreetValid && isHouseNumberValid;

        if (isValid) {
            LOG.info("Address validation PASSED.");
            return response.items().getFirst().position();
        }

        LOG.warn("Address validation FAILED due to strict matching rules.");
        return null;
    }
}