package pl.dmcs.userservice.dto.request;

import lombok.*;
import jakarta.validation.constraints.*;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.validation.ValidPhoneNumber;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtUserSyncRequest {

    @NotNull(message = "Keycloak ID nie może być null")
    private java.util.UUID id;

    @NotBlank(message = "Imię nie może być puste")
    @Size(min = 2, max = 100, message = "Imię musi mieć od 2 do 100 znaków")
    private String firstName;

    @NotBlank(message = "Nazwisko nie może być puste")
    @Size(min = 2, max = 100, message = "Nazwisko musi mieć od 2 do 100 znaków")
    private String lastName;

    @NotBlank(message = "Email nie może być pusty")
    @Email(message = "Email musi być prawidłowy")
    private String email;

    @NotBlank(message = "Numer telefonu nie może być pusty")
    @ValidPhoneNumber
    private String phoneNumber;

    @NotNull(message = "Typ użytkownika nie może być pusty")
    private UserType userType;
}

