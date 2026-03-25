# Payment Service

## Opis architektury
Mikroserwis odpowiedzialny za procesowanie płatności w ekosystemie przy użyciu bramki Stripe. Moduł działa w architekturze asynchronicznej – inicjuje sesję Checkout, weryfikuje kryptograficznie zdarzenia Webhook (potwierdzenia transakcji) z serwerów Stripe, aktualizuje stan lokalnej bazy danych i publikuje zdarzenia domenowe do RabbitMQ.

## Stos technologiczny
* Java 21 / Spring Boot 3.x
* PostgreSQL (Spring Data JPA / Hibernate)
* Stripe Java SDK
* RabbitMQ (Spring AMQP)
* Stripe CLI (Konteneryzacja dla środowiska deweloperskiego)

## Wymagania uruchomieniowe
Do pełnego uruchomienia i testowania serwisu lokalnie (z zamknięciem obwodu Webhook) wymagane są:
1. Instancja RabbitMQ (domyślnie port 5672).
2. Instancja bazy PostgreSQL.
3. Kontener Stripe CLI (działający jako tunel przekierowujący zdarzenia z chmury Stripe na Twój `localhost`).
4. Plik konfiguracyjny `.env` w katalogu podpiętym pod Docker Compose (zawierający klucz testowy Stripe `STRIPE_SECRET_KEY`).

### Zmienne Środowiskowe (Environment Variables)
Serwis wymaga wstrzyknięcia następujących kluczy (np. przez konfigurację Run/Debug w IntelliJ):
* `STRIPE_SECRET_KEY` - Prywatny klucz API Stripe (format: `sk_test_...`)
* `STRIPE_WEBHOOK_SECRET` - Klucz do podpisywania i weryfikacji Webhooków lokalnie (format: `whsec_...`)

> **Krytyczne dla bezpieczeństwa zespołu:** Pliki `.env` są ignorowane przez Git (`.gitignore`). Nigdy nie commituj rzeczywistych kluczy do repozytorium. Pobierz je z bezpiecznego kanału komunikacji zespołu.

## Endpointy API

### 1. Generowanie sesji płatności
Zwraca adres URL, na który frontend powinien przekierować użytkownika w celu dokonania wpłaty.

* **URL:** `/api/payments/create-session`
* **Metoda:** `POST`
* **Content-Type:** `application/json`
* **Payload:**
  ```json
  {
    "orderId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 2137,
    "customerEmail": "klient@mail.com"
  }
### 2. Odbiornik Webhook (Stripe Only)
Endpoint przeznaczony wyłącznie do komunikacji Server-to-Server z infrastrukturą Stripe.

URL: /api/payments/webhook

Metoda: POST

Logika: Weryfikuje nagłówek Stripe-Signature. Przetwarza wyłącznie zdarzenia typu checkout.session.completed wymuszając twardą deserializację.

Komunikacja Asynchroniczna (RabbitMQ)
Po pomyślnym zaksięgowaniu wpłaty, mikroserwis działa jako Publisher, emitując zdarzenie o zmianie statusu płatności w celu zawiadomienia modułów zamówień (order-service) i powiadomień (notification-service).

Exchange: payment_exchange (TopicExchange)

Routing Key: payment.completed

Format wiadomości (JSON):

  ```json
  {
    "orderId": "UUID",
    "status": "PAID",
    "amount": 150.50
  }
   ```
### Instrukcja testowania End-to-End (Lokalnie)
Uruchom tunel nasłuchujący (Stripe CLI)
Wykonaj z poziomu głównego katalogu (tam gdzie docker-compose.yml):

Bash
docker-compose up -d stripe-cli
Pobierz Webhook Secret
Odczytaj logi kontenera, aby zdobyć wygenerowany klucz kryptograficzny tunelu:

Bash
docker logs stripe-cli-forwarder
Skopiuj ciąg znaków rozpoczynający się od whsec_....

Uruchom aplikację
Wklej skopiowany klucz jako zmienną środowiskową STRIPE_WEBHOOK_SECRET w konfiguracji uruchomieniowej Spring Boota i wystartuj serwis.

Wykonaj transakcję próbną

Użyj pliku requests.http w IntelliJ, by strzelić do endpointu /create-session.

Otwórz otrzymany link w przeglądarce.

Użyj numeru testowej karty Stripe: 4242 4242 4242 4242 (dowolna data w przyszłości, dowolny CVC).

Sprawdź konsolę payment-service - log o zaksięgowaniu wpłaty i wypchnięciu wiadomości do RabbitMQ potwierdza poprawność obwodu.