package pl.dmcs.userservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.dmcs.userservice.model.Transport;
import java.util.List;
import java.util.UUID;

public interface TransportRepository extends JpaRepository<Transport, UUID> {
    List<Transport> findByCourierId(UUID courierId);
    
    Page<Transport> findAll(Pageable pageable);
    
    Page<Transport> findByCourierId(UUID courierId, Pageable pageable);

    @Query("SELECT t FROM Transport t WHERE LOWER(CONCAT(t.brand, ' ', t.model, ' ', t.licensePlate)) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Transport> searchTransports(@Param("searchTerm") String searchTerm, Pageable pageable);
}

