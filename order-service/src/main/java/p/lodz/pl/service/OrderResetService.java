package p.lodz.pl.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import p.lodz.pl.client.UserServiceClient;
import p.lodz.pl.dto.UserDTO;
import p.lodz.pl.model.Location;
import p.lodz.pl.model.Order;
import p.lodz.pl.model.enums.OrderStatus;
import p.lodz.pl.repository.OrderRepository;
import p.lodz.pl.repository.RouteRepository;
import p.lodz.pl.repository.RouteStopRepository;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@ApplicationScoped
public class OrderResetService {

    private static final int TARGET_ORDERS = 1000; // Zwiększono do 1000
    private static final String ADDRESSES_RESOURCE = "seed/addresses.csv";

    @Inject
    OrderRepository orderRepository;

    @Inject
    RouteRepository routeRepository;

    @Inject
    RouteStopRepository routeStopRepository;

    @Inject
    @RestClient
    UserServiceClient userServiceClient;

    @Inject
    EntityManager entityManager;

    @Transactional
    public long resetOrdersToDefaults() {
        hardDeleteAll();

        List<UserDTO> customers = userServiceClient.getCustomers();
        if (customers == null || customers.isEmpty()) {
            throw new IllegalStateException("No CUSTOMER users available for reset");
        }

        List<AddressRecord> addresses = loadAddresses();
        if (addresses.size() < 2) {
            throw new IllegalStateException("Need at least 2 addresses for reset");
        }

        Random random = new Random(); // Inicjalizacja generatora losowego

        for (int i = 1; i <= TARGET_ORDERS; i++) {
            UserDTO customer = customers.get((i - 1) % customers.size());

            // Losowanie różnych adresów dla pickup i delivery
            int pickupIndex = random.nextInt(addresses.size());
            int deliveryIndex = random.nextInt(addresses.size());

            // Upewniamy się, że punkt odbioru i dostawy to nie to samo miejsce
            while (deliveryIndex == pickupIndex) {
                deliveryIndex = random.nextInt(addresses.size());
            }

            AddressRecord pickupAddress = addresses.get(pickupIndex);
            AddressRecord deliveryAddress = addresses.get(deliveryIndex);

            Location pickup = buildLocation(pickupAddress);
            Location delivery = buildLocation(deliveryAddress);

            Order order = new Order();
            order.trackingNumber = String.format("BD-TEST-%04d", i);
            order.customerId = customer.id() != null ? customer.id() : UUID.randomUUID();
            order.status = resolveStatus(i);
            order.weight = BigDecimal.valueOf(1 + (i % 25));
            order.volume = BigDecimal.valueOf(1 + (i % 5));
            order.pickupLocation = pickup;
            order.deliveryLocation = delivery;
            order.recipientFirstName = "Test";
            order.recipientLastName = "Recipient " + i;
            order.recipientEmail = "recipient" + i + "@example.com";
            order.recipientPhone = String.format("500%06d", 100000 + i);

            orderRepository.persist(order);
        }

        return TARGET_ORDERS;
    }

    private void hardDeleteAll() {
        entityManager.createNativeQuery("DELETE FROM route_stops").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM routes").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM orders").executeUpdate();
        entityManager.createNativeQuery("DELETE FROM locations").executeUpdate();
    }

    private OrderStatus resolveStatus(int index) {
        int mod = index % 20;
        if (mod <= 7) {
            return OrderStatus.ORDER_CREATED;
        }
        if (mod <= 15) {
            return OrderStatus.IN_SORTING_CENTER;
        }
        if (mod == 16) {
            return OrderStatus.ORDER_RECEIVED_FROM_CUSTOMER;
        }
        if (mod == 17) {
            return OrderStatus.IN_TRANSIT_TO_CUSTOMER;
        }
        if (mod == 18) {
            return OrderStatus.WAITING_FOR_PAYMENT;
        }
        return OrderStatus.DELIVERY_COMPLETED;
    }

    private Location buildLocation(AddressRecord address) {
        Location location = new Location();
        location.streetAddress = address.streetAddress;
        location.postalCode = address.postalCode;
        location.city = address.city;
        location.country = address.country;
        location.latitude = BigDecimal.valueOf(address.latitude);
        location.longitude = BigDecimal.valueOf(address.longitude);
        return location;
    }

    private List<AddressRecord> loadAddresses() {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(ADDRESSES_RESOURCE);
        if (inputStream == null) {
            return List.of();
        }

        List<AddressRecord> result = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line = reader.readLine();
            if (line == null) {
                return List.of();
            }

            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                    continue;
                }
                String[] parts = trimmed.split(",", -1);
                if (parts.length < 6) {
                    continue;
                }
                result.add(new AddressRecord(
                        parts[0].trim(),
                        parts[1].trim(),
                        parts[2].trim(),
                        parts[3].trim(),
                        Double.parseDouble(parts[4].trim()),
                        Double.parseDouble(parts[5].trim())
                ));
            }
        } catch (Exception ex) {
            return List.of();
        }
        return result;
    }

    private static final class AddressRecord {
        private final String streetAddress;
        private final String postalCode;
        private final String city;
        private final String country;
        private final double latitude;
        private final double longitude;

        private AddressRecord(
                String streetAddress,
                String postalCode,
                String city,
                String country,
                double latitude,
                double longitude
        ) {
            this.streetAddress = streetAddress;
            this.postalCode = postalCode;
            this.city = city;
            this.country = country;
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }
}