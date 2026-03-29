package pl.dmcs.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dmcs.paymentservice.model.PaymentTransaction;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {

    Optional<PaymentTransaction> findByStripeSessionId(String stripeSessionId);

    Optional<PaymentTransaction> findByOrderId(UUID orderId);
}