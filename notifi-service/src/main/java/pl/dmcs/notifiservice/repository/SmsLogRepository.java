package pl.dmcs.notifiservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.notifiservice.model.SmsLog;
import java.util.List;
import java.util.UUID;

@Repository
public interface SmsLogRepository extends JpaRepository<SmsLog, UUID> {
    List<SmsLog> findAllByOrderByCreatedAtDesc();
}