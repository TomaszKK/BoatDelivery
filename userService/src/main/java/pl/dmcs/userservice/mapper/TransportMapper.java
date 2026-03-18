package pl.dmcs.userservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.dto.response.TransportResponse;
import pl.dmcs.userservice.model.Transport;

@Mapper(componentModel = "spring")
public interface TransportMapper {

    Transport toEntity(TransportRequest dto);

    @Mapping(source = "courier.id", target = "courierId")
    TransportResponse toResponse(Transport entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(TransportRequest dto, @MappingTarget Transport entity);
}
