# 🚀 BoatDelivery


## Instalacja i Uruchomienie

### Wymagania

- Docker & Docker Compose
- Java 21+
- Maven 3.8+
- Node.js 18+ (do frontenda)
- PostgreSQL 17 (lub Docker)

### 1. Klonowanie Projektu

```bash
git clone https://github.com/TomaszKK/BoatDelivery.git
cd BoatDelivery
```

### 2. Uruchomienie Infrastruktury (Docker)

```bash
docker-compose up -d
```

Usługi uruchomią się na portach:

| Usługa        | Port | URL                                                |
|---------------|------|----------------------------------------------------|
| PostgreSQL    | 5432 | `jdbc:postgresql://localhost:5432/user_service_db` |
| Keycloak      | 8060 | `http://localhost:8060`                            |
| Eureka        | 8761 | `http://localhost:8761/eureka/`                    |
| Gateway       | 8080 | `http://localhost:8080`                            |
| User-Service  | 8081 | `http://localhost:8081`                            |
| Order-Service | 8082 | `http://localhost:8082`                            |

### 3. Uruchomienie Serwisów (Terminal)

#### Terminal 1: Eureka Server

```bash
cd eurekaServer
mvn spring-boot:run
```

#### Terminal 2: User Service

```bash
cd userService
mvn spring-boot:run
```

#### Terminal 3: Order Service (Quarkus)

```bash
cd order-service
mvn quarkus:dev
```

#### Terminal 4: Spring Gateway

```bash
cd springGateway
mvn spring-boot:run
```

#### Terminal 5: Frontend (React)

```bash
cd front
npm install
npm run dev
```

### Weryfikacja Uruchomienia

```bash
# Sprawdź zarejestrowane serwisy
curl http://localhost:8761/eureka/apps

# Sprawdzenie Keycloaka
curl http://localhost:8060/realms/boat-delivery-realm/.well-known/openid-configuration

# Test Gateway
curl http://localhost:8080/api/user
```

---

## 🔐 Keycloak - Konfiguracja

### 📍 Dostęp

- **URL:** `http://localhost:8060`
- **Admin Console:** `http://localhost:8060/admin`
- **Login:** `admin`
- **Password:** `admin`

### 🏢 Realm: `boat-delivery-realm`

Konfiguracja jest automatycznie importowana z pliku:
```
docker/keycloak/imports/boat-delivery-realm-realm.json
```

### 👥 Clients (Aplikacje)

#### 1. **auth-gateway** (Spring Cloud Gateway)

- **Client ID:** `auth-gateway`
- **Client Secret:** `V5JXUTu8QVsXcRfo6jEdw5qbyjLltI6K`
- **Grant Type:** Authorization Code
- **Redirect URIs:**
  - `http://localhost:8080/login/oauth2/code/keycloak`
  - `http://localhost:8080/oauth2/authorization/keycloak`
- **Scopes:** `openid profile email phone`
- **Typ:** Public Client (CORS enabled)

**Rola:** Tworzy sesję OAuth2 dla użytkownika

#### 2. **Dla Nowych Serwisów (Stateless)**

Nowe serwisy **NIE tworza sesji**. Zamiast tego walidują JWT otrzymany od Gateway'a.

Tworzenie nowego client'a:

1. Wejdź na `http://localhost:8060/admin` → Realm `boat-delivery-realm`
2. Clients → Create
3. Konfiguracja:
   - **Client ID:** np. `new-service`
   - **Enabled:** ✅
   - **Client Authentication:** OFF (stateless)
   - **Standard Flow Enabled:** OFF
   - **Direct Access Grants Enabled:** OFF
4. Zapisz

### 👤 Użytkownicy - Wymagane Pola przy Rejestracji

System waliduje następujące pola:

| Pole         | Wymagane | Typ          | Walidacja                                 |
|--------------|----------|--------------|-------------------------------------------|
| `username`   | ✅       | String       | *Unikalny, 3-50 znaków                    |
| `email`      | ✅       | String       | Unikalny, format email                    |
| `firstName`  | ✅       | String       | *2-100 znaków                             |
| `lastName`   | ✅       | String       | *2-100 znaków                             |
| `phone`      | ✅*      | String       | `+48XXXXXXXXX` (9 cyfr), Unikalny         |
| `password`   | ✅       | String       | *Min 8 znaków, kompleksowy (rekomendacja) |

*do zrobienia

### 📱 Attribute Mappers (JWT Claims)

Keycloak jest skonfigurowany do dodawania w JWT następujących claim'ów:

```json
{
  "sub": "3f550330-d932-4547-8946-6a67f0fef0d1",
  "email": "user@example.com",
  "given_name": "John",
  "family_name": "Doe",
  "phone_number": "+48511404354",
  "preferred_username": "johndoe",
  "email_verified": true,
  "realm_access": {
    "roles": ["CUSTOMER", "COURIER", "ADMIN"]
  }
}
```

### 🔄 JWT Token Flow

```
1. Frontend wysyła credentials
                 ↓
2. Keycloak waliduje i wydaje JWT
                 ↓
3. Frontend wysyła JWT do Gateway'a
                 ↓
4. Gateway waliduje JWT i przekazuje do serwisu
                 ↓
5. Serwis waliduje JWK (public key z Keycloaka)
                 ↓
6. Serwis przetwarza request
```

## 🚩 Feature Flags

### Konfiguracja

Feature flags są kontrolowane przez property `app.security.enabled` w każdym serwisie:

#### UserService (`application.properties`)

```properties
app.security.enabled=false  # Disable JWT validation (DEV mode)
```

#### SpringGateway (`application.yml`)

```yaml
app:
  security:
    enabled: false  # Disable OAuth2 (DEV mode)
```

### Scenariusze Użycia

#### ✅ Development (Flags OFF)

```properties
app.security.enabled=false
```

- Brak walidacji JWT
- Brak OAuth2 na Gateway'u
- Łatwe testowanie bez Keycloaka

#### 🔒 Production (Flags ON)

```properties
app.security.enabled=true
```

- Wymagane JWT
- Walidacja OAuth2
- Rate limiting (future)
- Request logging (future)

### Implementacja w Kodzie

#### UserService

```java
@Configuration
@ConditionalOnProperty(name = "app.security.enabled", havingValue = "true")
public class SecurityConfig {
    // JWT validation configuration
}
```

#### SpringGateway

```java
@Configuration
@ConditionalOnProperty(name = "app.security.enabled", havingValue = "true")
public class OAuth2Config {
    // OAuth2 configuration
}
```

---

## 🔗 Integracja Nowego Serwisu z Keycloakiem

### Wymagania

- Nowy serwis **MUSI BYĆ STATELESS**
- Każdy request zawiera JWT w header'e `Authorization: Bearer <token>`
- Serwis **NIE TWORZY** sesji - waliduje token od Gateway'a

### Step-by-Step Guide

#### 1. Dodaj Zależności do `pom.xml`

```xml
<!-- OAuth2 Resource Server -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>

<!-- Eureka Client -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>

<!-- Spring Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

#### 2. Konfiguracja `application.properties`

```properties
# Server
server.port=8083
spring.application.name=new-service

# Feature Flag
app.security.enabled=true

# Eureka
eureka.client.service-url.defaultZone=http://127.0.0.1:8761/eureka
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.prefer-ip-address=true

# Security - JWT Validation
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8060/realms/boat-delivery-realm/protocol/openid-connect/certs
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8060/realms/boat-delivery-realm

# Logging
logging.level.org.springframework.security=DEBUG
logging.level.your.package=DEBUG
```

#### 3. Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/health", "/metrics").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                )
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // ← WAŻNE!
            );
        
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return JwtDecoders.fromIssuerLocation("http://localhost:8060/realms/boat-delivery-realm");
    }
}
```
#### 4. Dodaj do Keycloaka

W Keycloak Admin Console:

1. Clients → Create
2. Client ID: `new-service`
3. **Client Authentication:** OFF (stateless!)
4. Zapisz

#### 5. Dodaj do Gateway Routes (`application.yml`)

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: new-service-route
          uri: lb://new-service
          predicates:
            - Path=/api/new-service/**
```

#### 6. Zarejestruj w Eureka

```java
@SpringBootApplication
@EnableDiscoveryClient
public class NewServiceApplication {
    static void main(String[] args) {
        SpringApplication.run(NewServiceApplication.class, args);
    }
}
```

## 🛠️ Technologie

### Backend

| Komponenta       | Wersja  | Opis                                   |
|-----------------|---------|----------------------------------------|
| Java            | 21      | JDK                                    |
| Spring Boot     | 4.0.3   | Framework                              |
| Spring Cloud    | 2025.1  | Microservices (Gateway, Eureka)       |
| Spring Security | 6.x     | OAuth2 Resource Server                |
| Quarkus         | Latest  | Order Service (reactive)               |
| PostgreSQL      | 17      | Database                               |
| Keycloak        | 26.5.6  | Identity & Access Management          |
| MapStruct       | 1.5.5   | Entity-DTO mapping                     |
| Lombok          | Latest  | Boilerplate reduction                  |
| Flyway          | 9.x     | Database migrations                    |

### Frontend

| Komponenta | Wersja | Opis              |
|-----------|--------|-------------------|
| React     | 18+    | UI Framework      |
| Vite      | 5+     | Build tool        |
| TypeScript| 5+     | Type safety       |
| TailwindCSS| Latest | Styling           |
| i18n      | Latest | Internationalization |

### DevOps

| Komponenta | Wersja | Opis        |
|-----------|--------|-------------|
| Docker    | Latest | Containerization |
| Docker Compose | Latest | Orchestration |
| Maven     | 3.8+   | Build tool  |

