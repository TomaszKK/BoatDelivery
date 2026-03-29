package p.lodz.pl.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import p.lodz.pl.dto.maps.DirectionsApiResponse;

@RegisterRestClient(configKey = "google-maps-api")
public interface GoogleMapsClient {
    @GET
    @Path("/maps/api/directions/json")
    DirectionsApiResponse getDirections(
            @QueryParam("origin") String origin,
            @QueryParam("destination") String destination,
            @QueryParam("key") String apiKey
    );
}
