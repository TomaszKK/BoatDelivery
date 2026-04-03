package pl.dmcs.userservice.sync;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Klient do komunikacji z Keycloak Admin API
 * Pobiera token admin i wysyła żądania do Keycloaka
 */
@Component
public class KeycloakAdminClient {

    private static final Logger log = LoggerFactory.getLogger(KeycloakAdminClient.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String keycloakUrl;
    private final String keycloakRealm;
    private final String adminUsername;
    private final String adminPassword;

    private String cachedToken;
    private long tokenExpiryTime;

    @Autowired
    public KeycloakAdminClient(
            RestTemplate restTemplate,
            ObjectMapper objectMapper,
            @Value("${app.sync.keycloak-admin-url}") String keycloakUrl,
            @Value("${app.sync.keycloak-realm}") String keycloakRealm,
            @Value("${app.sync.keycloak-admin-username}") String adminUsername,
            @Value("${app.sync.keycloak-admin-password}") String adminPassword) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.keycloakUrl = keycloakUrl;
        this.keycloakRealm = keycloakRealm;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.tokenExpiryTime = 0;
    }

    /**
     * Pobiera token admin z Keycloaka
     * Uwzględnia cache - token jest ważny przez ~5 minut
     */
    public String getAdminToken() {
        // Jeśli mamy cachedToken i nie wygasł - zwróć go
        if (cachedToken != null && System.currentTimeMillis() < tokenExpiryTime) {
            log.debug("Używam cached Keycloak admin token");
            return cachedToken;
        }

        try {
            log.debug("Pobieranie nowego Keycloak admin token...");

            String tokenUrl = String.format("%s/realms/master/protocol/openid-connect/token", keycloakUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", "admin-cli");
            body.add("username", adminUsername);
            body.add("password", adminPassword);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            String response = restTemplate.postForObject(tokenUrl, request, String.class);
            if (response == null) {
                log.error("Pusty response z Keycloaka przy pobieraniu tokenu");
                return null;
            }

            JsonNode jsonNode = objectMapper.readTree(response);
            String token = jsonNode.get("access_token").asText();
            long expiresIn = jsonNode.get("expires_in").asLong();

            // Cache token na 90% jego czasu życia
            this.cachedToken = token;
            this.tokenExpiryTime = System.currentTimeMillis() + (expiresIn * 900L);

            log.debug("Pomyślnie pobrany Keycloak admin token (wygasa za {} sekund)", expiresIn);
            return token;

        } catch (RestClientException e) {
            log.error("Błąd sieci przy pobieraniu tokenu z Keycloaka: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Błąd przy pobieraniu tokenu z Keycloaka: {}", e.getMessage(), e);
            return null;
        }
    }
}

