package pl.dmcs.userservice.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {

    private static final String POLISH_PATTERN = "^\\+48\\d{9}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        String cleanedValue = value.replaceAll("\\s+", "");
        return cleanedValue.matches(POLISH_PATTERN);
    }
}

