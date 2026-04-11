package p.lodz.pl.messaging;

import io.smallrye.reactive.messaging.rabbitmq.OutgoingRabbitMQMetadata;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Message;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;
import p.lodz.pl.client.UserServiceClient;
import p.lodz.pl.dto.OrderEvent;
import p.lodz.pl.dto.UserDTO;
import p.lodz.pl.model.Order;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class OrderEventPublisher {

    private static final Logger LOG = Logger.getLogger(OrderEventPublisher.class);

    @Inject
    @Channel("order-events")
    Emitter<OrderEvent> emitter;

    @Inject
    @RestClient
    UserServiceClient userServiceClient;

    // Metoda z 1 argumentem (używana przez OrderService)
    public void publishOrderChange(Order order) {
        publishOrderChange(order, null);
    }

    // Metoda z 2 argumentami (używana przez RouteService)
    public void publishOrderChange(Order order, UUID courierId) {

        UserDTO customer = null;
        UserDTO courier = null;

        // 1. Pobieranie danych Klienta
        try {
            customer = userServiceClient.getUserById(order.customerId);
        } catch (Exception e) {
            LOG.error("Nie udało się pobrać danych klienta z user-service dla id: " + order.customerId, e);
        }

        // 2. Pobieranie danych Kuriera (jeśli został podany)
        if (courierId != null) {
            try {
                courier = userServiceClient.getUserById(courierId);
            } catch (Exception e) {
                LOG.error("Nie udało się pobrać danych kuriera z user-service dla id: " + courierId, e);
            }
        }

        // Zabezpieczenie przed NullPointerException
        String customerEmail = customer != null ? customer.email() : "brak-email@system.pl";
        String customerPhone = customer != null ? customer.phoneNumber() : "";
        String firstName = customer != null ? customer.firstName() : "Klient";
        String lastName = customer != null ? customer.lastName() : "";

        String courierEmail = courier != null ? courier.email() : null;
        String courierPhone = courier != null ? courier.phoneNumber() : null;

        String pickup = order.pickupLocation.streetAddress + ", " + order.pickupLocation.city;
        String delivery = order.deliveryLocation.streetAddress + ", " + order.deliveryLocation.city;

        // Określenie odbiorców komunikatu
        List<String> targetAudience = new ArrayList<>();
        targetAudience.add("CUSTOMER");
        if (courierId != null) {
            targetAudience.add("COURIER");
        }

        OrderEvent event = new OrderEvent(
                order.status.name(),
                order.id,
                order.trackingNumber,
                targetAudience,
                null, null,
                customerEmail,
                courierEmail,
                customerPhone,
                courierPhone,
                firstName, lastName,
                pickup,
                delivery
        );

        OutgoingRabbitMQMetadata metadata = OutgoingRabbitMQMetadata.builder()
                .withRoutingKey("order." + order.status.name().toLowerCase())
                .build();

        Message<OrderEvent> message = Message.of(event)
                .addMetadata(metadata)
                .withAck(() -> {
                    LOG.info("SUKCES! Event " + order.status.name() + " trafił do RabbitMQ.");
                    return java.util.concurrent.CompletableFuture.completedFuture(null);
                })
                .withNack(reason -> {
                    LOG.error("BŁĄD WYSYŁKI na RabbitMQ: ", reason);
                    return java.util.concurrent.CompletableFuture.completedFuture(null);
                });

        emitter.send(message);
    }
}