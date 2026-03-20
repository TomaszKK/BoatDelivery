package pl.dmcs.notifiservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    @Column(name = "recipient_email", nullable = false)
    private String recipientEmail;

    @Column(name = "status", nullable = false)
    private String status; // Do wpisania SUCCESS lub ERROR

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public NotificationLog() {}

    // Przykladowy konstruktor do logowania wysylki w bazie danych
    public NotificationLog(String orderId, String recipientEmail, String status, String errorMessage) {
        this.orderId = orderId;
        this.recipientEmail = recipientEmail;
        this.status = status;
        this.errorMessage = errorMessage;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getOrderId() { return orderId; }
    public String getRecipientEmail() { return recipientEmail; }
    public String getStatus() { return status; }
    public String getErrorMessage() { return errorMessage; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}