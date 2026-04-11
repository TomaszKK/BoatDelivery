package p.lodz.pl.mapper;

import org.mapstruct.Mapper;
import p.lodz.pl.dto.RouteResponseDTO;
import p.lodz.pl.dto.RouteStopDTO;
import p.lodz.pl.model.Route;
import p.lodz.pl.model.RouteStop;

@Mapper(componentModel = "jakarta")
public interface RouteMapper {

    RouteResponseDTO toDto(Route entity);

    RouteStopDTO toDto(RouteStop entity);
}