package pl.dmcs.userservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.dto.response.TransportResponse;
import pl.dmcs.userservice.model.Transport;
import pl.dmcs.userservice.model.User;

@Mapper(componentModel = "spring")
public interface TransportMapper {

    Transport toEntity(TransportRequest dto);

    @Mapping(source = "courier", target = "courier")
    TransportResponse toResponse(Transport entity);

    @Mapping(source = "id", target = "id")
    @Mapping(source = "firstName", target = "firstName")
    @Mapping(source = "lastName", target = "lastName")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    TransportResponse.CourierDTO userToCourierDTO(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(TransportRequest dto, @MappingTarget Transport entity);
}
