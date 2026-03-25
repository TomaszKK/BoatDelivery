package pl.dmcs.paymentservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.paymentservice.dto.PaymentRequest;
import pl.dmcs.paymentservice.dto.PaymentResponse;
import pl.dmcs.paymentservice.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-session")
    public ResponseEntity<?> createSession(@RequestBody PaymentRequest request) {
        try {
            String checkoutUrl = paymentService.createPaymentSession(request);
            return ResponseEntity.ok(new PaymentResponse(checkoutUrl));
        } catch (Exception e) {
            System.err.println("Błąd generowania sesji Stripe: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Nie udało się utworzyć sesji płatności: " + e.getMessage());
        }
    }
}