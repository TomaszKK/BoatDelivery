package pl.dmcs.userservice.dto.request;

import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.validation.ValidPhoneNumber;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

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

