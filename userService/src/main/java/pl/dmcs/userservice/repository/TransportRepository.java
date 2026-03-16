package pl.dmcs.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.dmcs.userservice.model.Transport;
import java.util.List;

public interface TransportRepository extends JpaRepository<Transport, Long> {
    List<Transport> findByCourierId(Long courierId);
}

