package pl.dmcs.notifiservice.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;
    private static final String SENDER = "system@boatdelivery.pl";

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(SENDER);
            helper.setTo(to);
            helper.setSubject(subject);

            String htmlContent = """
                <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <p>%s</p>
                    <br/>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"/>
                    <img src='cid:logo' alt='BoatDelivery' style='max-width: 150px;'/>
                </body>
                </html>
                """.formatted(text.replace("\n", "<br/>"));

            helper.setText(htmlContent, true);

            ClassPathResource logo = new ClassPathResource("logo.png");
            helper.addInline("logo", logo, "image/png");

            mailSender.send(message);
            System.out.println("Wysłano e-mail do: " + to + " | Temat: " + subject);
        } catch (MessagingException e) {
            throw new RuntimeException("Błąd podczas wysyłania e-maila", e);
        }
    }

    public String sendInvoiceEmail(String to, String ref, String invoiceUrl) {
        String subject = "Potwierdzenie płatności i faktura za zlecenie nr: " + ref;
        String text = String.format("Cześć,\n\nDziękujemy za opłacenie zlecenia nr %s.\n\nTwoja faktura jest dostępna do pobrania pod tym linkiem:\n%s\n\nPozdrawiamy,\nZespół BoatDelivery", ref, invoiceUrl);
        sendEmail(to, subject, text);
        return text;
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

    public String sendInTransitToCustomerEmail(String to, String ref, String name) {
        String subject = "Paczka w drodze do odbiorcy! Nr: " + ref;
        String text = String.format("Cześć %s,\n\nTwoja paczka nr: %s wyruszyła w trasę do odbiorcy!\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref);
        sendEmail(to, subject, text);
        return text;
    }

    public String sendDeliveryCompletedEmail(String to, String ref, String name) {
        String subject = "Doręczono paczkę nr: " + ref;
        String text = String.format("Cześć %s,\n\nPaczka nr: %s została doręczona. Dziękujemy!\n\nPozdrawiamy,\nZespół BoatDelivery", name, ref);
        sendEmail(to, subject, text);
        return text;
    }

    // --- PROCES ODBIORCY PACZKI ---

    public String sendRecipientOrderCreatedEmail(String to, String ref, String recipientName, String senderName) {
        String subject = "Ktoś nadał do Ciebie paczkę! Nr: " + ref;
        String text = String.format("Cześć %s,\n\nUżytkownik %s właśnie nadał do Ciebie paczkę nr: %s. Poinformujemy Cię, gdy wyruszy w trasę.\n\nPozdrawiamy,\nZespół BoatDelivery", recipientName, senderName, ref);
        sendEmail(to, subject, text);
        return text;
    }

    public String sendRecipientInTransitEmail(String to, String ref, String recipientName, String courierPhone) {
        String subject = "Paczka do Ciebie jest już w drodze! Nr: " + ref;
        String text = String.format("Cześć %s,\n\nKurier jedzie do Ciebie z paczką nr: %s. Telefon do kuriera: %s.\n\nPozdrawiamy,\nZespół BoatDelivery", recipientName, ref, courierPhone);
        sendEmail(to, subject, text);
        return text;
    }
    public String sendRecipientOrderDelivered(String to, String ref, String recipientName) {
        String subject = "Doręczono paczkę nr: " + ref;
        String text = String.format("Cześć %s,\n\nPaczka nr: %s została doręczona. Dziękujemy!\n\nPozdrawiamy,\nZespół BoatDelivery", recipientName, ref);
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