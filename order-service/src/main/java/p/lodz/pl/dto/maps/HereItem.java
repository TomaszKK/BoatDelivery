package p.lodz.pl.dto.maps;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HereItem(HereAddress address, HerePosition position) {}
