package pl.dmcs.keycloak;

import com.google.gson.Gson;
import org.jboss.logging.Logger;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.events.admin.OperationType;
import org.keycloak.events.admin.ResourceType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class UserRegistrationEventListenerProvider implements EventListenerProvider {

    private static final Logger log = Logger.getLogger(UserRegistrationEventListenerProvider.class);
    private final KeycloakSession session;
    private final HttpClient httpClient;
    private final Gson gson = new Gson();

    public UserRegistrationEventListenerProvider(KeycloakSession session) {
        this.session = session;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
    }

    @Override
    public void onEvent(Event event) {
        if (event.getType() == EventType.REGISTER) {
            String userId = event.getUserId();
            RealmModel realm = session.realms().getRealm(event.getRealmId());
            UserModel user = session.users().getUserById(realm, userId);

            if (user != null) {
                log.infof("Nowy uzytkownik zarejestrowany: %s.", userId);

                // 1. ODCZYTUJEMY TYP KONTA Z FORMULARZA
                String accountType = user.getFirstAttribute("ACCOUNT_TYPE");
                if (accountType == null || accountType.isBlank()) {
                    log.warn("Brak atrybutu ACCOUNT_TYPE. Ustawiam domyslnie na CUSTOMER.");
                    accountType = "CUSTOMER";
                }

                // 2. NADAJEMY ROLĘ W KEYCLOAKU
                // (Role CUSTOMER i COURIER musza wczesniej zostac utworzone w panelu Keycloaka!)
                org.keycloak.models.RoleModel roleToAssign = realm.getRole(accountType);
                if (roleToAssign != null) {
                    user.grantRole(roleToAssign);
                    log.infof("Sukces: Nadano role %s uzytkownikowi %s", roleToAssign.getName(), user.getUsername());
                } else {
                    log.errorf("Krytyczny blad: Rola %s nie istnieje w realmie!", accountType);
                }

                // 3. WYSYŁAMY DO MIKROSERWISU
                sendUserToMicroservice(user, accountType); // Zmodyfikuj metode, by przyjmowala accountType
            }
        }
    }

    private void sendUserToMicroservice(UserModel user, String accountType) {
        try {
            String firstName = user.getFirstName() != null ? user.getFirstName() : "";
            String lastName = user.getLastName() != null ? user.getLastName() : "";
            String email = user.getEmail() != null ? user.getEmail() : "";

            String phoneAttr = user.getFirstAttribute("phoneNumber");
            String phoneNumber = phoneAttr != null ? phoneAttr : "";

            UserPayload payload = new UserPayload(user.getId(), email, firstName, lastName, phoneNumber, accountType);
            String jsonPayload = gson.toJson(payload);

            String secret = System.getenv("WEBHOOK_KEYCLOAK_SECRET");
            if (secret == null || secret.isBlank()) {
                log.warn("BRAK KONFIGURACJI: Zmienna WEBHOOK_KEYCLOAK_SECRET jest pusta. Uzywam zastepczego klucza.");
                secret = "c8d904f5-5322-4d56-affb-fe63b9c436fb";
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://user-service:8081/api/internal/user/webhook/register"))
                    .header("Content-Type", "application/json")
                    .header("X-Keycloak-Secret", secret)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() >= 200 && response.statusCode() < 300) {
                            log.infof("Pomyslnie zsynchronizowano usera %s. Odpowiedz UserService: %d", user.getId(), response.statusCode());
                        } else {
                            log.errorf("Blad synchronizacji usera %s. Odrzucone przez UserService. Status: %d", user.getId(), response.statusCode());
                        }
                    })
                    .exceptionally(ex -> {
                        log.error("Nie udalo sie polaczyc z UserService! Sprawdz czy host.docker.internal dziala i czy port 8081 jest otwarty.", ex);
                        return null;
                    });

        } catch (Exception e) {
            log.error("Krytyczny blad podczas przygotowywania danych do UserService", e);
        }
    }

    // POJO dla serializacji JSON
    private static class UserPayload {
        private final String id;
        private final String email;
        private final String firstName;
        private final String lastName;
        private final String phoneNumber;
        private final String userType;

        public UserPayload(String id, String email, String firstName, String lastName, String phoneNumber, String userType) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.phoneNumber = phoneNumber;
            this.userType = userType;
        }

        public String getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public String getUserType() {
            return userType;
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {
        try {
            log.infof("=== DEBUG AdminEvent ===");
            log.infof("Operation: %s", adminEvent.getOperationType());
            log.infof("Resource Type: %s", adminEvent.getResourceType());
            log.infof("Resource Path: %s", adminEvent.getResourcePath());
            log.infof("Realm ID: %s", adminEvent.getRealmId());

            if (adminEvent.getOperationType() == OperationType.CREATE &&
                adminEvent.getResourceType() == ResourceType.REALM_ROLE_MAPPING) {
                try {
                    String resourcePath = adminEvent.getResourcePath();
                    log.infof("Przetwarzam CREATE REALM_ROLE_MAPPING event. Resource path: %s", resourcePath);

                    // Ekstrakcja userId z ścieżki: users/{userId}/role-mappings/realm
                    String[] pathParts = resourcePath.split("/");
                    if (pathParts.length < 2) {
                        log.warnf("Nie można ekstrakcji userId z ścieżki: %s", resourcePath);
                        return;
                    }

                    String userId = pathParts[1];
                    log.infof("Wyekstraktowany userId: %s", userId);

                    RealmModel realm = session.realms().getRealm(adminEvent.getRealmId());
                    if (realm == null) {
                        log.warnf("Nie znaleziono realm z ID: %s", adminEvent.getRealmId());
                        return;
                    }

                    UserModel user = session.users().getUserById(realm, userId);

                    if (user != null) {
                        log.infof("Rola przypisana do użytkownika: %s. Pobieram userType z Keycloaka...", userId);

                        // Pobranie userType z przypisanej roli
                        String userType = extractUserType(user, realm);

                        log.infof("Pobrany userType dla %s: %s", userId, userType);
                        sendUserToMicroservice(user, userType);
                    } else {
                        log.warnf("Nie znaleziono usera z ID: %s", userId);
                    }
                } catch (Exception e) {
                    log.error("Blad podczas przetwarzania AdminEvent dla REALM_ROLE_MAPPING", e);
                }
            } else {
                log.debugf("AdminEvent nie pasuje do warunków: OperationType=%s, ResourceType=%s",
                    adminEvent.getOperationType(), adminEvent.getResourceType());
            }
        } catch (Exception e) {
            log.error("KRYTYCZNY blad w onEvent(AdminEvent)", e);
        }
    }

    private String extractUserType(UserModel user, RealmModel realm) {
        // 1. Sprawdź atrybut USER_TYPE w użytkowniku
        String userTypeAttribute = user.getFirstAttribute("USER_TYPE");
        if (userTypeAttribute != null && !userTypeAttribute.isBlank()) {
            log.infof("Znaleziono atrybut USER_TYPE: %s", userTypeAttribute);
            return userTypeAttribute;
        }

        // 2. Sprawdź przypisane role (CUSTOMER, COURIER, ADMIN)
        log.infof("Sprawdzam role przypisane do użytkownika %s", user.getUsername());
        for (String roleType : new String[]{"CUSTOMER", "COURIER", "ADMIN"}) {
            org.keycloak.models.RoleModel role = realm.getRole(roleType);
            if (role != null && user.hasRole(role)) {
                log.infof("Znaleziono role: %s", roleType);
                return roleType;
            }
        }

        // 3. Domyślnie zwróć ADMIN
        log.warn("Nie znaleziono userType w atrybutach ani w rolach. Domyślnie ustawiam ADMIN.");
        return "USER";
    }

    @Override
    public void close() {
    }
}