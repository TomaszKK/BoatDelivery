package pl.dmcs.notifiservice.service.sms;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

//@Service
public class SmsApiSender implements SmsSender {

    private final String apiToken;
    private final String senderName;
    private final HttpClient httpClient;

    public SmsApiSender(
            @Value("${smsapi.token}") String apiToken,
            @Value("${smsapi.sender}") String senderName) {
        this.apiToken = apiToken;
        this.senderName = senderName;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    @Override
    public String sendSms(String phoneNumber, String message) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Brak numeru telefonu do wysyłki SMS.");
        }

        try {
            // Api akcpetuje bez +, walidacja numeru telefonu
            String cleanPhone = phoneNumber.replace("+", "").replaceAll("\\s+", "");

            String requestBody = String.format("to=%s&from=%s&message=%s&format=json",
                    URLEncoder.encode(cleanPhone, StandardCharsets.UTF_8),
                    URLEncoder.encode(senderName, StandardCharsets.UTF_8),
                    URLEncoder.encode(message, StandardCharsets.UTF_8)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.smsapi.pl/sms.do"))
                    .header("Authorization", "Bearer " + apiToken)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

           //Wysylka Api
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 && response.body().contains("\"list\"")) {
                System.out.println("Pomyślnie wysłano SMS na numer: " + cleanPhone);
                return message;
            } else {
                throw new RuntimeException("Odrzut z bramki SMSAPI: " + response.body());
            }

        } catch (Exception e) {
            throw new RuntimeException("Awaria modułu nadawczego SMS: " + e.getMessage(), e);
        }
    }
}