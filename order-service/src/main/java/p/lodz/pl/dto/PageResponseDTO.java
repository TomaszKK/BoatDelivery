package p.lodz.pl.dto;

import java.util.List;

public record PageResponseDTO<T>(
        List<T> content,
        int currentPage,
        int totalPages,
        long totalElements
) {}