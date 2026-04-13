package p.lodz.pl.service;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.enums.OrderStatus;
import java.time.LocalDateTime;

@ApplicationScoped
public class OrderCleanupService {

    @Scheduled(every = "1h")
    @Transactional
    public void deleteExpiredUnpaidOrders() {
        LocalDateTime expirationThreshold = LocalDateTime.now().minusHours(24);

        long updatedCount = Order.update("status = ?1 where status = ?2 and createdAt < ?3",
                OrderStatus.ORDER_CANCELED,
                OrderStatus.WAITING_FOR_PAYMENT,
                expirationThreshold);

        if (updatedCount > 0) {
            System.out.println("CLEANUP: Anulowano " + updatedCount + " nieopłaconych zamówień (minęły 24h).");
        }
    }
}