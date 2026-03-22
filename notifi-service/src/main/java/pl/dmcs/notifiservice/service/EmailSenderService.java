package pl.dmcs.notifiservice.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(String to, String orderId, String status) {
        SimpleMailMessage message = new SimpleMailMessage();

        // Przykladowy mail do zmiany
        message.setFrom("system@boatdelivery.pl");
        message.setTo(to);
        message.setSubject("Aktualizacja zamówienia nr: " + orderId);
        message.setText("Dzień dobry,\n\nTwoje zamówienie o numerze " + orderId +
                " zmieniło status na: " + status + ".\n\nPozdrawiamy,\nZespół BoatDelivery");


        mailSender.send(message);
        System.out.println("Pomyślnie wysłano e-mail do: " + to);
    }
}