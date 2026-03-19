# 🚀 USER SERVICE - QUICK START

## 📦 Struktura projektu

```
userService/
├── src/
│   ├── main/
│   │   ├── java/pl/dmcs/userservice/
│   │   │   ├── controller/      # REST endpoints
│   │   │   ├── service/         # Logika biznesowa
│   │   │   ├── repository/      # Dostęp do BD
│   │   │   ├── model/           # Encje JPA
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── mapper/          # MapStruct mapery
│   │   │   ├── exception/       # Global Exception Handler
│   │   │   └── validation/      # Custom validators
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/    # Flyway migrations
│   └── test/
│       └── java/pl/dmcs/userservice/
│           ├── controller/      # Testy REST API
│           ├── dto/             # Testy walidacji DTO
│           ├── validation/      # Testy walidatorów
│           └── test/            # Test utilities (TestDataGenerator)
└── pom.xml
```

---

## 🗄️ Baza danych

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: user_service_db
- **User**: postgres
- **Password**: postgres

### Migracje (Flyway)
```
V1__Initial_schema.sql           → Tworzenie tabel
```

---

## 🔍 REST API

### User Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/user` | Tworzenie użytkownika |
| `GET` | `/api/user` | Pobranie wszystkich |
| `GET` | `/api/user/{id}` | Pobranie po ID |
| `PUT` | `/api/user/{id}` | Pełna aktualizacja |
| `PATCH` | `/api/user/{id}` | Częściowa aktualizacja |
| `DELETE` | `/api/user/{id}` | Usunięcie |

### Transport Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/transport/courier/{courierId}` | Dodaj transport |
| `GET` | `/api/transport` | Wszystkie transporty |
| `GET` | `/api/transport/{id}` | Po ID |
| `PUT` | `/api/transport/{id}` | Aktualizacja |
| `DELETE` | `/api/transport/{id}` | Usunięcie |

---

## ✅ Walidacja

### Phone Number
- ✅ TYLKO format `+48XXXXXXXXX` (9 cyfr)

### User Types
- `CUSTOMER` - Klient
- `COURIER` - Kurier
- `ADMIN` - Administrator

### Transport Types
- `CAR`, `BIKE`, `VAN`, `TRUCK`, `SCOOTER`

---

## 🛠️ Technologie

- **Java 21**
- **Spring Boot 4.0.3**
- **PostgreSQL 17**
- **Flyway** (migracje)
- **MapStruct** (mapowanie)
- **Lombok** (boilerplate)
- **JUnit 5** (testy)
- **MockMvc** (testy REST)
- **Faker** (test data)

---