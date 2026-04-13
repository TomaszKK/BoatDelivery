package pl.dmcs.paymentservice.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.dmcs.paymentservice.model.PaymentStatus;
import pl.dmcs.paymentservice.repository.PaymentTransactionRepository;

import java.time.LocalDateTime;

@Service
public class PaymentCleanupService {

    private final PaymentTransactionRepository transactionRepository;

    public PaymentCleanupService(PaymentTransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Scheduled(fixedRate = 3600000) // Co godzinę
    @Transactional
    public void cancelExpiredPayments() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        transactionRepository.findAll().stream()
                .filter(t -> t.getStatus() == PaymentStatus.PENDING && t.getCreatedAt().isBefore(threshold))
                .forEach(t -> {
                    t.setStatus(PaymentStatus.CANCELED);
                    transactionRepository.save(t);
                });

        System.out.println("CLEANUP: Przeskanowano płatności starsze niż 24h.");
    }
}