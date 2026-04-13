package pl.dmcs.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.dmcs.paymentservice.model.PaymentStatus;
import pl.dmcs.paymentservice.model.PaymentTransaction;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    Optional<PaymentTransaction> findByOrderId(UUID orderId);
    Optional<PaymentTransaction> findByStripeSessionId(String stripeSessionId);

    @Modifying
    @Query("UPDATE PaymentTransaction p SET p.status = :newStatus WHERE p.status = :oldStatus AND p.createdAt < :threshold")
    int updateStatusForExpiredPending(@Param("newStatus") PaymentStatus newStatus,
                                      @Param("oldStatus") PaymentStatus oldStatus,
                                      @Param("threshold") LocalDateTime threshold);
}