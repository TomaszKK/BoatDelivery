package p.lodz.pl.dto.maps;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record HerePosition(BigDecimal lat, BigDecimal lng) {}