#!/bin/sh
# Script do dodania testowych użytkowników do Keycloaka - Z VERBOSE LOGGING

KEYCLOAK_URL="http://keycloak:8060"
REALM="boat-delivery-realm"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin"

echo "========================================"
echo "Dodawanie testowych użytkowników do Keycloaka"
echo "========================================"

# Czekaj aż Keycloak się uruchomi
echo "Czekam na Keycloak..."
MAX_ATTEMPTS=120
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${KEYCLOAK_URL}/realms/${REALM}" 2>/dev/null || echo "000")

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Keycloak jest gotowy!"
    break
  fi

  echo "  Próba $ATTEMPT/$MAX_ATTEMPTS..."
  sleep 5
done

# Pobierz token
echo ""
echo "1. Pobieranie tokenu..."
TOKEN_RESPONSE=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=admin-cli" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASSWORD}" \
  -d "grant_type=password")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Błąd: Nie udało się pobrać tokenu"
  echo "Token Response: $TOKEN_RESPONSE"
  exit 1
fi

echo "✅ Token pobrany"

# Funkcja do dodania użytkownika
add_user() {
  local username=$1
  local email=$2
  local first_name=$3
  local last_name=$4
  local password=$5
  local role=$6
  local phone=$7

  echo ""
  echo "Dodawanie: $username ($email)"

  # Utwórz JSON bez ID - Keycloak generuje
  JSON_FILE="/tmp/user_${username}.json"
  cat > "$JSON_FILE" << 'JSONEOF'
{
  "username": "PLACEHOLDER_USERNAME",
  "email": "PLACEHOLDER_EMAIL",
  "firstName": "PLACEHOLDER_FIRST_NAME",
  "lastName": "PLACEHOLDER_LAST_NAME",
  "enabled": true,
  "emailVerified": true,
  "attributes": {
    "phoneNumber": "PLACEHOLDER_PHONE",
    "ACCOUNT_TYPE": "PLACEHOLDER_ACCOUNT_TYPE"
  },
  "credentials": [
    {
      "type": "password",
      "value": "PLACEHOLDER_PASSWORD",
      "temporary": false
    }
  ]
}
JSONEOF

  # Zastąp placeholdery (aby uniknąć problemów z cudzysłowami)
  sed -i "s|PLACEHOLDER_USERNAME|$username|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_EMAIL|$email|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_FIRST_NAME|$first_name|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_LAST_NAME|$last_name|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_PHONE|$phone|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_PASSWORD|$password|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_FIRST_NAME|$first_name|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_LAST_NAME|$last_name|g" "$JSON_FILE"
  sed -i "s|PLACEHOLDER_PASSWORD|$password|g" "$JSON_FILE"

  echo "  JSON: $(cat $JSON_FILE | head -c 100)..."

  # Wyślij request i zbierz całą odpowiedź
  CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${REALM}/users" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d @"$JSON_FILE")

  HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -1)
  BODY=$(echo "$CREATE_RESPONSE" | head -n -1)

  echo "  HTTP Code: $HTTP_CODE"
  if [ ! -z "$BODY" ]; then
    echo "  Response Body: $BODY"
  fi

  rm -f "$JSON_FILE"

  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
    echo "  ✅ Utworzony"
  elif [ "$HTTP_CODE" = "409" ]; then
    echo "  ⚠️  Już istnieje"
  else
    echo "  ❌ Błąd (HTTP: $HTTP_CODE)"
    return 1
  fi

  # Pobierz ID użytkownika (został właśnie utworzony)
  CREATED_USER_ID=$(curl -s "${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${username}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

  echo "  User ID: $CREATED_USER_ID"

  # Przydziel rolę
  if [ -n "$role" ] && [ -n "$CREATED_USER_ID" ]; then
    ROLE_ID=$(curl -s "${KEYCLOAK_URL}/admin/realms/${REALM}/roles?search=${role}" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

    echo "  Role ID: $ROLE_ID"

    if [ -n "$ROLE_ID" ]; then
      ROLE_JSON="/tmp/role_${username}.json"
      cat > "$ROLE_JSON" << 'ROLEJSONEOF'
[{"id":"PLACEHOLDER_ROLE_ID","name":"PLACEHOLDER_ROLE_NAME"}]
ROLEJSONEOF

      sed -i "s|PLACEHOLDER_ROLE_ID|$ROLE_ID|g" "$ROLE_JSON"
      sed -i "s|PLACEHOLDER_ROLE_NAME|$role|g" "$ROLE_JSON"

      ROLE_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X POST "${KEYCLOAK_URL}/admin/realms/${REALM}/users/${CREATED_USER_ID}/role-mappings/realm" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d @"$ROLE_JSON")

      echo "  Role HTTP Code: $ROLE_CODE"
      rm -f "$ROLE_JSON"

      if [ "$ROLE_CODE" = "204" ] || [ "$ROLE_CODE" = "200" ]; then
        echo "  ✅ Rola przydzielona: $role"
      fi
    fi
  fi
}

# Dodaj użytkowników
echo ""
echo "2. Dodawanie użytkowników..."
add_user "user1" "jan.kowalski@example.com" "Jan" "Kowalski" "Password123" "CUSTOMER" "+48501234567"
add_user "user2" "anna.nowak@example.com" "Anna" "Nowak" "Password123" "CUSTOMER" "+48601234567"
add_user "courier1" "piotr.lewandowski@example.com" "Piotr" "Lewandowski" "Password123" "COURIER" "+48701234567"
add_user "courier2" "marta.wisniewska@example.com" "Marta" "Wiśniewska" "Password123" "COURIER" "+48801234567"
add_user "courier3" "kamil.krawczyk@example.com" "Kamil" "Krawczyk" "Password123" "COURIER" "+48511111111"
add_user "courier4" "eva.zielinska@example.com" "Eva" "Zielińska" "Password123" "COURIER" "+48521111111"
add_user "courier5" "jakub.nowinski@example.com" "Jakub" "Nowiński" "Password123" "COURIER" "+48531111111"
add_user "courier6" "magdalena.lewandowska@example.com" "Magdalena" "Lewandowska" "Password123" "COURIER" "+48541111111"
add_user "courier7" "michal.wisniewski@example.com" "Michał" "Wiszniewski" "Password123" "COURIER" "+48551111111"
add_user "admin" "admin@example.com" "Admin" "User" "Password123" "ADMIN" "+48121234567"

echo ""
echo "3. Dodawanie pojazdów transportowych dla courierów..."
echo "⏳ Czekam 15 sekund na synchronizację użytkowników z UserService..."
sleep 15

# Funkcja do dodania pojazdu
add_transport() {
  local courier_email=$1
  local transport_type=$2
  local brand=$3
  local model=$4
  local fuel_type=$5
  local trunk_volume=$6
  local cargo_capacity=$7
  local consumption=$8
  local license_plate=$9
  local color=${10}

  echo ""
  echo "Dodawanie pojazdu: $brand $model ($transport_type) dla $courier_email"

  # Pobierz wszystkich userów i szukaj po email
  MAX_RETRIES=25
  RETRY=0
  COURIER_ID=""

  while [ $RETRY -lt $MAX_RETRIES ] && [ -z "$COURIER_ID" ]; do
    RETRY=$((RETRY + 1))

    # Pobierz listę userów z UserService - public endpoint
    USERS_JSON=$(curl -s -m 5 "http://user-service:8081/api/user/public/list" 2>/dev/null)

    # Szukaj couriera po email
    COURIER_ID=$(echo "$USERS_JSON" | grep -o "\"id\":\"[a-f0-9\-]*\"[^}]*\"email\":\"$courier_email\"" | head -1 | cut -d'"' -f4)

    # Jeśli nie znaleziono, spróbuj odwrotnie
    if [ -z "$COURIER_ID" ]; then
      COURIER_ID=$(echo "$USERS_JSON" | grep -B5 "\"email\":\"$courier_email\"" | grep "\"id\":\"" | head -1 | cut -d'"' -f4)
    fi

    if [ -z "$COURIER_ID" ]; then
      if [ $RETRY -lt $MAX_RETRIES ]; then
        echo "  ⏳ Próba $RETRY/$MAX_RETRIES - czekam na couriera w UserService..."
        sleep 2
      fi
    fi
  done

  if [ -z "$COURIER_ID" ]; then
    echo "  ❌ Błąd: Nie znaleziono couriera $courier_email w UserService"
    return 1
  fi

  echo "  ✅ Courier ID: $COURIER_ID"

  # Przygotuj JSON pojazdu
  TRANSPORT_JSON="/tmp/transport_${brand}.json"

  cat > "$TRANSPORT_JSON" << EOF
{
  "transportType": "$transport_type",
  "brand": "$brand",
  "model": "$model",
  "fuelType": "$fuel_type",
  "trunkVolume": $trunk_volume,
  "cargoCapacity": $cargo_capacity,
  "consumption": $consumption,
  "licensePlate": "$license_plate",
  "color": "$color"
}
EOF

  # Wyślij request do UserService API
  TRANSPORT_RESPONSE=$(curl -s -w "\n%{http_code}" -m 10 -X POST "http://user-service:8081/api/transport/courier/${COURIER_ID}" \
    -H "Content-Type: application/json" \
    -d @"$TRANSPORT_JSON" 2>/dev/null)

  TRANSPORT_CODE=$(echo "$TRANSPORT_RESPONSE" | tail -1)
  TRANSPORT_BODY=$(echo "$TRANSPORT_RESPONSE" | head -n -1)

  rm -f "$TRANSPORT_JSON"

  echo "  HTTP Code: $TRANSPORT_CODE"

  if [ "$TRANSPORT_CODE" = "201" ] || [ "$TRANSPORT_CODE" = "200" ]; then
    echo "  ✅ Pojazd dodany"
  else
    echo "  ❌ Błąd (HTTP: $TRANSPORT_CODE)"
  fi
}

# Dodaj pojazdy dla poszczególnych courierów
add_transport "piotr.lewandowski@example.com" "CAR" "Toyota" "Corolla" "PETROL" "450.0" "500.0" "6.5" "WA01BC1" "Silver"
add_transport "marta.wisniewska@example.com" "VAN" "Ford" "Transit" "DIESEL" "1200.0" "1500.0" "8.2" "WA02CD2" "White"
add_transport "kamil.krawczyk@example.com" "CAR" "Volkswagen" "Passat" "DIESEL" "490.0" "540.0" "6.2" "WA03UV3" "Blue"
add_transport "eva.zielinska@example.com" "TRUCK" "Volvo" "FH16" "DIESEL" "2500.0" "3500.0" "12.0" "WA04EF5" "Red"
add_transport "jakub.nowinski@example.com" "VAN" "Mercedes" "Sprinter" "DIESEL" "1400.0" "1800.0" "9.5" "WA05IJ7" "Gray"
add_transport "magdalena.lewandowska@example.com" "CAR" "Honda" "Civic" "PETROL" "490.0" "520.0" "6.8" "WA06GH6" "Blue"
add_transport "michal.wisniewski@example.com" "TRUCK" "Scania" "R450" "DIESEL" "3000.0" "4000.0" "14.0" "WA07ST2" "Orange"

echo ""
echo "========================================"
echo "✅ GOTOWE!"
echo "========================================"

