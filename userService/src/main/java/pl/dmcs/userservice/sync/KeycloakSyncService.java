package pl.dmcs.userservice.sync;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import pl.dmcs.userservice.model.User;

import java.util.HashMap;
import java.util.Map;

/**
 * Serwis do synchronizacji danych użytkownika z Keycloakiem
 * Wysyła aktualizacje imienia, nazwiska, emaila i numeru telefonu do Keycloaka
 */
@Service
public class KeycloakSyncService {

    private static final Logger log = LoggerFactory.getLogger(KeycloakSyncService.class);

    private final RestTemplate restTemplate;
    private final KeycloakAdminClient keycloakAdminClient;
    private final String keycloakUrl;
    private final String keycloakRealm;
    private final boolean syncEnabled;

    @Autowired
    public KeycloakSyncService(
            RestTemplate restTemplate,
            KeycloakAdminClient keycloakAdminClient,
            @Value("${app.sync.keycloak-admin-url}") String keycloakUrl,
            @Value("${app.sync.keycloak-realm}") String keycloakRealm,
            @Value("${app.sync.enabled:true}") boolean syncEnabled) {
        this.restTemplate = restTemplate;
        this.keycloakAdminClient = keycloakAdminClient;
        this.keycloakUrl = keycloakUrl;
        this.keycloakRealm = keycloakRealm;
        this.syncEnabled = syncEnabled;
    }

    /**
     * Synchronizuje dane użytkownika z User-Service do Keycloaka
     * Aktualizuje: firstName, lastName, email, attributes (phoneNumber)
     */
    public void syncUserToKeycloak(User user) {
        if (!syncEnabled) {
            log.debug("Synchronizacja do Keycloaka wyłączona");
            return;
        }

        if (user == null || user.getId() == null) {
            log.warn("Nie można zsynchronizować użytkownika: null");
            return;
        }

        try {
            log.info("Synchronizowanie użytkownika do Keycloaka: {} ({})", user.getEmail(), user.getId());

            String token = keycloakAdminClient.getAdminToken();
            if (token == null || token.isEmpty()) {
                log.error("Nie udało się pobrać tokenu admin z Keycloaka");
                return;
            }

            String updateUrl = String.format(
                    "%s/admin/realms/%s/users/%s",
                    keycloakUrl,
                    keycloakRealm,
                    user.getId()
            );

            Map<String, Object> updateData = new HashMap<>();
            updateData.put("firstName", user.getFirstName() != null ? user.getFirstName() : "");
            updateData.put("lastName", user.getLastName() != null ? user.getLastName() : "");
            updateData.put("email", user.getEmail() != null ? user.getEmail() : "");

            // Telefon jako attribute
            Map<String, Object> attributes = new HashMap<>();
            if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
                attributes.put("phoneNumber", user.getPhoneNumber());
            }
            updateData.put("attributes", attributes);

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.set("Content-Type", "application/json");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(updateData, headers);

            ResponseEntity<Void> response = restTemplate.exchange(
                    updateUrl,
                    HttpMethod.PUT,
                    requestEntity,
                    Void.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Pomyślnie zsynchronizowano użytkownika {} do Keycloaka", user.getId());
            } else {
                log.error("Błąd synchronizacji użytkownika do Keycloaka. Status: {}", response.getStatusCode());
            }

        } catch (RestClientException e) {
            log.error("Błąd podczas synchronizacji użytkownika do Keycloaka: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Nieoczekiwany błąd podczas synchronizacji do Keycloaka: {}", e.getMessage(), e);
        }
    }
}

