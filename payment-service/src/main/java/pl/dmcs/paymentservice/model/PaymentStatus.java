package pl.dmcs.paymentservice.model;

public enum PaymentStatus {
    PENDING,    // Platnosc oczekuje
    PAID,  // Platnosc zakonczona
    FAILED,     // Platnosc nieudana
    CANCELED    // Platnosc odrzucona
}