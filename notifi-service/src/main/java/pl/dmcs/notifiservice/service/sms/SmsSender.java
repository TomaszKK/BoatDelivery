package pl.dmcs.notifiservice.service.sms;

public interface SmsSender {
    String sendSms(String phoneNumber, String message);
}