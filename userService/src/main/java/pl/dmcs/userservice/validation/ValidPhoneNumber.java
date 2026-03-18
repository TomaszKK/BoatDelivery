package pl.dmcs.userservice.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PhoneNumberValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhoneNumber {
    String message() default "Numer telefonu musi być prawidłowym polskim numerem (+48 lub 0 i 9 cyfr)";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

