package pl.dmcs.notifiservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.notifiservice.model.NotificationLog;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {
    List<NotificationLog> findAllByOrderByCreatedAtDesc();
}