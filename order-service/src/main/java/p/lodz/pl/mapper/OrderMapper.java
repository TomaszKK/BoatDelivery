package p.lodz.pl.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import p.lodz.pl.dto.OrderRequestDTO;
import p.lodz.pl.dto.OrderResponseDTO;
import p.lodz.pl.model.Order;

@Mapper(componentModel = "cdi")
public interface OrderMapper {

    Order toEntity(OrderRequestDTO dto);

    OrderResponseDTO toDto(Order entity);

    void updateEntityFromDto(OrderRequestDTO dto, @MappingTarget Order entity);
}