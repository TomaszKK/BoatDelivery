package p.lodz.pl.dto;

import java.util.UUID;

public record UserDTO(
        UUID id,
        String username,
        String email,
        String role
) {}