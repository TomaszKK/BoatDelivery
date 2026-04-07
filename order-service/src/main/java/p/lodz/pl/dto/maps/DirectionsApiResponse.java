package p.lodz.pl.dto.maps;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DirectionsApiResponse(List<Route> routes) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Route(List<Leg> legs) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Leg(Distance distance) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Distance(Integer value, String text) {}
}