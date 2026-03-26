package pl.dmcs.paymentservice.model;

public enum PaymentStatus {
    PENDING,    // Platnosc oczekuje
    COMPLETED,  // Platnosc zakonczona
    FAILED,     // Platnosc nieudana
    CANCELED    // Platnosc odrzucona
}