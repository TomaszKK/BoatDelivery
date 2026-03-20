package pl.dmcs.userservice.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import pl.dmcs.userservice.dto.request.JwtUserSyncRequest;
import pl.dmcs.userservice.dto.request.UpdateUserRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.dto.response.UserResponse;
import pl.dmcs.userservice.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(UserRequest dto);

    User toEntity(JwtUserSyncRequest dto);

    UserResponse toResponse(User entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UserRequest dto, @MappingTarget User entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateUserRequest dto, @MappingTarget User entity);
}