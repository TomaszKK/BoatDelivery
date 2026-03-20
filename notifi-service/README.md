# Notification Service

Rozproszony układ wykonawczy do obsługi powiadomień asynchronicznych w architekturze mikroserwisów. Serwis nasłuchuje na zdarzenia z kolejki RabbitMQ i równolegle realizuje trzy zadania: wysyłkę e-maila do klienta, wypchnięcie powiadomienia real-time na frontend (SSE) oraz zapis logu audytowego w bazie PostgreSQL.

## ⚙️ Stack Technologiczny
* **Framework:** Spring Boot 4.x (WebFlux dla Gateway, domyślnie MVC dla notyfikacji)
* **Broker wiadomości:** RabbitMQ (AMQP)
* **Baza danych:** PostgreSQL (Spring Data JPA / Hibernate)
* **Powiadomienia Real-Time:** Server-Sent Events (SSE)
* **Protokół pocztowy:** Serwer SMTP (Mailtrap dla środowiska DEV)

## 🏗️ Architektura przepływu (Flow)
1. **Order Service** (Quarkus) publikuje zdarzenie na centralę `boatdelivery.exchange`.
2. **RabbitMQ** routuje paczkę (klucz `order.created`) do kolejki `notification.email.queue`.
3. `EmailNotificationListener` przechwytuje JSON-a i uruchamia obwód:
    * **Akcja 1:** Wysyłka e-maila przez `EmailSenderService`.
    * **Akcja 2:** Strumieniowanie do Reacta przez `NotificationController`.
    * **Akcja 3:** Twardy zapis statusu operacji w tabeli `notification_logs`.

##  Uruchomienie lokalne

1. Upewnij się, że infrastruktura Dockera (RabbitMQ, Postgres, API Gateway, Eureka) jest uruchomiona.
2. Skonfiguruj zmienne środowiskowe dla SMTP (Mailtrap) w `application.yml`:
   ```yaml
   spring:
     mail:
       host: sandbox.smtp.mailtrap.io
       port: 2525
       username: <TWÓJ_USER>
       password: <TWOJE_HASŁO>
3. Uruchom aplikację z poziomu IDE lub Mavena

🛠## 🛠️ Testowanie systemu (Manual Override)

Aby przetestować obwód bez konieczności stawiania serwisu zamówień (Order Service), wykonaj bezpośredni wtrysk danych do brokera:

### 1. Przez panel RabbitMQ
1. Wejdź na `http://localhost:15672` (admin / admin).
2. Przejdź do zakładki **Exchanges** -> `boatdelivery.exchange`.
3. Rozwiń sekcję **Publish message**.
4. Ustaw parametry:
    * **Routing key:** `order.created`
    * **Headers:** `content_type` = `application/json`
5. Wklej Payload:
   ```json
   {
     "orderId": "ZAM-TEST-001",
     "customerEmail": "test@boatdelivery.pl",
     "status": "NEW"
   }
6. Kliknij Publish message.

### 2. Weryfikacja poprawności obwodu
Jeśli system działa poprawnie, powinieneś zaobserwować trzy rzeczy:

Frontend: Na odpalonej aplikacji React (podpiętej pod Gateway) wyskoczy "Toast" z informacją o nowym zamówieniu (nasłuch na http://localhost:8080/api/notifications/stream).

E-mail: W skrzynce Mailtrap pojawi się wygenerowana wiadomość dla klienta.

Baza Danych: W IntelliJ (Database Tool) lub pgAdmin w tabeli notification_logs pojawi się nowy wiersz ze statusem SUCCESS (lub ERROR wraz ze zrzutem stosu z serwera SMTP).

📡 Endpointy (API)
GET /api/notifications/stream - Otwarty kanał Server-Sent Events dla przeglądarek. Wymusza nagłówki CORS dla portu deweloperskiego Vite (localhost:5173).