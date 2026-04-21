package pl.dmcs.userservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dmcs.userservice.dto.request.JwtUserSyncRequest;
import pl.dmcs.userservice.model.User;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.repository.UserRepository;

@RestController
@RequestMapping("/api/internal/user/webhook")
public class InternalUserWebhookController {

    private static final Logger log = LoggerFactory.getLogger(InternalUserWebhookController.class);

    private final UserRepository userRepository;
    private final String expectedSecret;

    public InternalUserWebhookController(
            UserRepository userRepository,
            @Value("${app.webhook.keycloak-secret}") String expectedSecret) {
        this.userRepository = userRepository;
        this.expectedSecret = expectedSecret;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> handleKeycloakRegistration(
            @RequestHeader(value = "X-Keycloak-Secret", required = false) String providedSecret,
            @RequestBody JwtUserSyncRequest request) {

        log.info("Otrzymano webhook z Keycloak dla usera: {}", request.getEmail());

        if (providedSecret == null || !expectedSecret.equals(providedSecret)) {
            log.warn("Odrzucono webhook: nieprawidlowy klucz! Otrzymano: {}", providedSecret);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            if (!userRepository.existsById(request.getId())) {
                User newUser = new User();
                newUser.setId(request.getId());
                newUser.setEmail(request.getEmail());
                newUser.setFirstName(request.getFirstName());
                newUser.setLastName(request.getLastName());
                newUser.setPhoneNumber(request.getPhoneNumber());
                newUser.setUserType(request.getUserType() != null ? request.getUserType() : UserType.CUSTOMER);
                newUser.setCreatedBy("keycloak-webhook");

                userRepository.save(newUser);
                log.info("Pomyslnie zapisano uzytkownika {} w bazie danych", request.getEmail());
            } else {
                log.info("Uzytkownik o ID {} juz istnieje. Pomijam zapis.", request.getId());
            }
        } catch (Exception e) {
            log.error("Blad podczas zapisu uzytkownika z webhooka: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }
}
