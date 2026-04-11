package pl.dmcs.userservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Page<User> findAll(Pageable pageable);
    
    Page<User> findByUserType(UserType userType, Pageable pageable);
    
    long countByUserType(UserType userType);
}
