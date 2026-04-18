package pl.dmcs.userservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Page<User> findAll(Pageable pageable);
    
    Page<User> findByUserType(UserType userType, Pageable pageable);
    
    long countByUserType(UserType userType);

    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName, ' ', u.email)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.userType = :userType AND LOWER(CONCAT(u.firstName, ' ', u.lastName, ' ', u.email)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsersByType(@Param("searchTerm") String searchTerm, @Param("userType") UserType userType, Pageable pageable);
}
