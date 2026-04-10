package pl.dmcs.userservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCountByTypeDTO {
    private long totalUsers;
    private long customerCount;
    private long courierCount;
    private long adminCount;
}

