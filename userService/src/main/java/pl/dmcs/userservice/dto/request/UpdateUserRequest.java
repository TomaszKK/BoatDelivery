package pl.dmcs.userservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.validation.ValidPhoneNumber;

/**
 * DTO dla PATCH - wszystkie pola OPCJONALNE
 * Może się zmienić tylko firstName, reszta zostaje bez zmian
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(min = 2, max = 100, message = "Imię musi mieć od 2 do 100 znaków")
    private String firstName;

    @Size(min = 2, max = 100, message = "Nazwisko musi mieć od 2 do 100 znaków")
    private String lastName;

    @NotBlank(message = "Email nie może być pusty")
    @Email(message = "Email musi być prawidłowy")
    private String email;

    @NotBlank(message = "Numer telefonu nie może być pusty")
    @ValidPhoneNumber
    private String phoneNumber;

    private UserType userType;
}

