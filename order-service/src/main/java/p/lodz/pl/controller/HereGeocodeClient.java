package p.lodz.pl.controller;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import p.lodz.pl.dto.maps.HereGeocodeResponse;

@RegisterRestClient(configKey = "here-geocode-api")
public interface HereGeocodeClient {
    @GET
    @Path("/v1/geocode")
    HereGeocodeResponse getGeocode(
            @QueryParam("q") String query,
            @QueryParam("apiKey") String apiKey
    );
}
