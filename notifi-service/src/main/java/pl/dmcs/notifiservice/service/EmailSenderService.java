package pl.dmcs.notifiservice.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;
    private static final String SENDER = "system@boatdelivery.pl";

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(SENDER);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
        System.out.println("Wysłano e-mail do: " + to + " | Temat: " + subject);
    }

    // --- PROCES ODBIORU ---

    public String sendOrderCreatedEmail(String to, String ref, String name) {
        String subject = "Zlecenie nadania paczki nr: " + ref;
        String text = String.format("Cześć %s,\n\nPrzyjęliśmy Twoje zlecenie nr: %s. Oczekuj na przypisanie kuriera, który odbierze paczkę.\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref);
        sendEmail(to, subject, text);
        return text;
    }

    public String sendInTransitForPackageEmail(String to, String ref, String name, String address, String phone) {
        String subject = "Kurier jedzie po Twoją paczkę nr: " + ref;
        String text = String.format("Cześć %s,\n\nKurier wyruszył z bazy i kieruje się po odbiór Twojej paczki nr: %s do %s. Telefon kuriera do kontaktu %s\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref, address, phone);
        sendEmail(to, subject, text);
        return text;
    }

    public String sendOrderReceivedEmail(String to, String ref, String name) {
        String subject = "Odebraliśmy paczkę nr: " + ref;
        String text = String.format("Cześć %s,\n\nKurier pomyślnie odebrał Twoją paczkę nr: %s. Zmierza teraz do sortowni.\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref);
        sendEmail(to, subject, text);
        return text;
    }

    // --- PROCES DOSTAWY ---

    public String sendInTransitToCustomerEmail(String to, String ref, String name, String address, String phone) {
        String subject = "Paczka w drodze do Ciebie! Nr: " + ref;
        String text = String.format("Cześć %s,\n\nTwoja paczka nr: %s wyruszyła w trasę do: %s. Telefon kuriera do kontaktu %s.\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref, phone, address);
        sendEmail(to, subject, text);
        return text;
    }

    public String sendDeliveryCompletedEmail(String to, String ref, String name) {
        String subject = "Doręczono paczkę nr: " + ref;
        String text = String.format("Cześć %s,\n\nPaczka nr: %s została doręczona. Dziękujemy!\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref);
        sendEmail(to, subject, text);
        return text;
    }

    // --- PROCES KURIERA ---

    public String sendRouteAssignedEmail(String to, java.math.BigDecimal distance, Integer duration) {
        String subject = "Nowa trasa przypisana";
        String text = String.format("Cześć,\n\nZostała Ci przypisana nowa trasa. Całkowity dystans: %.1f km, szacowany czas: %d min.\n\nSzerokiej drogi,\nZespół BoatDelivery", distance, duration);
        sendEmail(to, subject, text);
        return text;
    }

    public String sendCourierCancellationEmail(String to, String ref, String address) {
        String subject = "UWAGA: Anulacja zlecenia w trasie nr: " + ref + ")";
        String text = String.format("Cześć,\n\nZlecenie nr %s zostało właśnie anulowane przez klienta lub centralę. Pomiń adres: %s.\n\nZespół BoatDelivery", ref, address);
        sendEmail(to, subject, text);
        return text;
    }


    // --- ANULACJA ---

    public String sendCancellationEmail(String to, String ref, String name) {
        String subject = "Anulacja zlecenia nr: " + ref;
        String text = String.format("Cześć %s,\n\nZlecenie nr: %s zostało anulowane.\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref);
        sendEmail(to, subject, text);
        return text;
    }
}