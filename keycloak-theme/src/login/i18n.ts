import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            accountTypeTitle: "Select account type",
            customerTitle: "Regular Customer",
            customerDesc: "I want to send and receive packages",
            courierTitle: "Courier",
            courierDesc: "I want to deliver packages",
            phoneNumberLabel: "Phone number",
            backToLogin: "Back to login",
            allRightsReserved: "All rights reserved.",
            emailForgotTitle: "Forgot Password?",
            emailInstruction: "Enter your email address and we will send you instructions on how to reset your password.",
            doSubmit: "Send reset link",
            
            "error-phoneNumber-invalid-format": "Invalid phone number format. It must start with +48 followed by 9 digits.",
            "error-invalid-password": "Password is too weak or invalid.",
        },
        pl: {
            accountTypeTitle: "Wybierz typ konta",
            customerTitle: "Zwykły Klient",
            customerDesc: "Chcę wysyłać i odbierać paczki",
            courierTitle: "Kurier",
            courierDesc: "Chcę rozwozić zamówienia",
            phoneNumberLabel: "Numer telefonu",
            backToLogin: "Wróć do logowania",
            allRightsReserved: "Wszelkie prawa zastrzeżone.",
            emailForgotTitle: "Nie pamiętasz hasła?",
            emailInstruction: "Wpisz swój adres e-mail (lub login), a wyślemy Ci instrukcję resetowania hasła.",
            doSubmit: "Wyślij link",
            
            "error-phoneNumber-invalid-format": "Nieprawidłowy format numeru telefonu. Musi zaczynać się od +48 i składać z 9 cyfr.",
            "error-invalid-password": "Hasło jest zbyt słabe lub nieprawidłowe.",
        }
    })
    .build();

export type I18n = typeof ofTypeI18n;
export { useI18n };