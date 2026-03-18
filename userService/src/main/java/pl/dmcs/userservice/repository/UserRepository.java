package pl.dmcs.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.dmcs.userservice.model.User;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
}
