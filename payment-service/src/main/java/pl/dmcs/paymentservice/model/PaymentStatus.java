package pl.dmcs.paymentservice.model;

public enum PaymentStatus {
    PENDING,    // Platnosc oczekuje
    PAID,  // Platnosc zakonczona
    CANCELED    // Platnosc odrzucona
}