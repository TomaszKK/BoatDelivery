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
            
            updatePasswordTitle: "Set new password",
            passwordNew: "New password",
            passwordConfirm: "Confirm new password",
            logoutOtherSessions: "Log out from all devices",
            doCancel: "Cancel",
            doUpdatePassword: "Update Password",
            
            "usernameExistsMessage": "Username already exists.",
            "emailExistsMessage": "Email already exists.",
            "error-phoneNumber-exists": "This phone number is already registered.",
            "error-user-attribute-already-exists": "This value is already registered.",
            "error-phoneNumber-invalid-format": "Invalid phone number format. It must start with +48 followed by 9 digits.",
            "error-invalid-password": "Password is too weak or invalid.",

            valRequired: "This field is required.",
            valEmail: "Invalid email format.",
            valPhone: "Must start with +48 followed by 9 digits.",
            valMinLength: "Minimum length is {0} characters.",
            valMatch: "Passwords do not match.",
            valUpperCase: "Must contain at least one uppercase letter.",
            valLowerCase: "Must contain at least one lowercase letter.",
            valDigit: "Must contain at least one digit."
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
            doUpdatePassword: "Zaktualizuj hasło",
            
            updatePasswordTitle: "Ustaw nowe hasło",
            passwordNew: "Nowe hasło",
            passwordConfirm: "Potwierdź nowe hasło",
            logoutOtherSessions: "Wyloguj ze wszystkich urządzeń",
            doCancel: "Anuluj",
            
            "usernameExistsMessage": "Nazwa użytkownika jest już zajęta.",
            "emailExistsMessage": "Adres e-mail jest już zajęty.",
            "error-phoneNumber-exists": "Ten numer telefonu jest już zarejestrowany.",
            "error-user-attribute-already-exists": "Ta wartość jest już zarejestrowana przez innego użytkownika.",
            "error-phoneNumber-invalid-format": "Nieprawidłowy format numeru telefonu. Musi zaczynać się od +48 i składać z 9 cyfr.",
            "error-invalid-password": "Hasło jest zbyt słabe lub nieprawidłowe.",

            valRequired: "To pole jest wymagane.",
            valEmail: "Nieprawidłowy format adresu e-mail.",
            valPhone: "Wymagane +48 i 9 cyfr.",
            valMinLength: "Minimalna długość to {0} znaków.",
            valMatch: "Hasła nie pasują do siebie.",
            valUpperCase: "Musi zawierać co najmniej jedną wielką literę.",
            valLowerCase: "Musi zawierać co najmniej jedną małą literę.",
            valDigit: "Musi zawierać co najmniej jedną cyfrę."
        }
    })
    .build();

export type I18n = typeof ofTypeI18n;
export { useI18n };