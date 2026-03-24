package pl.dmcs.notifiservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)                         // Id bazowe
    private UUID id;

    @Column(name = "order_id", nullable = false)                            // Id zamowienia systemowe
    private UUID orderId;

    @Column(name = "reference_number", nullable = false)                    // Numer zamowienia paczki dla klienta
    private String referenceNumber;

    @Column(name = "recipient_email", nullable = false)                     // Adres email odbiorcy
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)                              // Status wysylki (error, success)
    private NotificationStatus status;

    @Column(name = "message_content", columnDefinition = "TEXT")            // Tresc wiadomosci
    private String messageContent;

    @Column(name = "error_message", columnDefinition = "TEXT")              // Blad wysylki
    private String errorMessage;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)       // Czas wysylki
    private LocalDateTime createdAt;
}