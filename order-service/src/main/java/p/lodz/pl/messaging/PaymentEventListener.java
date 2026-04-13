package p.lodz.pl.messaging;

import io.smallrye.common.annotation.Blocking;
import io.vertx.core.json.JsonObject;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import p.lodz.pl.service.OrderService;
import java.util.UUID;

@ApplicationScoped
public class PaymentEventListener {

    @Inject
    OrderService orderService;

    @Incoming("payment-in")
    @Blocking
    public void handlePayment(byte[] messageBytes) {
        try {

            String message = new String(messageBytes);
            System.out.println("QUARKUS ODEBRAŁ EVENT Z RABBITA: " + message);

            JsonObject payload = new JsonObject(message);

            if ("PAID".equals(payload.getString("status"))) {
                System.out.println("ZAPLACONO ZA ZLECENIE");
                UUID orderId = UUID.fromString(payload.getString("orderId"));
                orderService.markOrderAsPaid(orderId);
            }
        } catch (Exception e) {
            System.err.println("Błąd dekodowania eventu płatności z RabbitMQ: " + e.getMessage());
        }
    }
}