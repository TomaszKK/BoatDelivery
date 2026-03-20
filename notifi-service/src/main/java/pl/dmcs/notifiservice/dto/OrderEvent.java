package pl.dmcs.notifiservice.dto;

public record OrderEvent( // Przykladowe dane do powiadomien testowych
        String orderId,
        String customerEmail,
        String status
) {}