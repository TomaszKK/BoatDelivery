package pl.dmcs.notifiservice.service.sms;

import org.springframework.stereotype.Service;

@Service
public class MockSmsSender implements SmsSender {

    @Override
    public String sendSms(String phoneNumber, String message) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Brak numeru telefonu do wysyłki SMS.");
        }

        System.out.println("==========================================");
        System.out.println("[MOCK SMS] Odbiorca: " + phoneNumber);
        System.out.println("[MOCK SMS] Treść: " + message);
        System.out.println("==========================================");

        return message;
    }
}