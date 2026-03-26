package pl.dmcs.notifiservice.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record OrderEvent(
        String eventType,            // Statusy paczek
        UUID orderId,                // Numer zlecenia w systemie
        String trackingNumber,      // Numer paczki dla klienta
        List<String> targetAudience, // CUSTOMOER LUB COURIER
        BigDecimal totalDistanceKm,  // Dystans w kilometrach trasy kuriera
        Integer estimatedDurationMin,// Czas trasy kuriera w minetach?
        String customerEmail,        // E-mail klienta
        String courierEmail,         // E-mail kuriera
        String customerPhone,        // Telefon klienta
        String courierPhone,         // Telefon kuriera
        String firstName,
        String lastName,
        String pickupAddress,        // Adres nadania
        String deliveryAddress       // Adres docelowy
) {}
