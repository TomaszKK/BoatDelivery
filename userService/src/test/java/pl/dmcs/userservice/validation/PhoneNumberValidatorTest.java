package pl.dmcs.userservice.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import jakarta.validation.ConstraintValidatorContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@DisplayName("PhoneNumberValidator - Walidacja numerów telefonów polskich")
class PhoneNumberValidatorTest {

    private PhoneNumberValidator validator;
    private ConstraintValidatorContext context;

    @BeforeEach
    void setUp() {
        validator = new PhoneNumberValidator();
        context = mock(ConstraintValidatorContext.class);
    }

    @Test
    @DisplayName("Powinno zaakceptować numer z +48 bez spacji")
    void shouldAcceptPolishNumberWithPlusPrefix() {
        assertTrue(validator.isValid("+48123456789", context));
    }

    @Test
    @DisplayName("Powinno zaakceptować numer z +48 ze spacjami")
    void shouldAcceptPolishNumberWithPlusPrefixAndSpaces() {
        assertTrue(validator.isValid("+48 123 456 789", context));
    }

    @ParameterizedTest
    @DisplayName("Powinno odrzucić numery z za mało cyframi")
    @ValueSource(strings = {"123", "12345", "+48123", "0123"})
    void shouldRejectNumberWithTooFewDigits(String phoneNumber) {
        assertFalse(validator.isValid(phoneNumber, context));
    }

    @ParameterizedTest
    @DisplayName("Powinno odrzucić numery nie polskie")
    @ValueSource(strings = {"+33123456789", "+44123456789", "+1234567890"})
    void shouldRejectNonPolishNumbers(String phoneNumber) {
        assertFalse(validator.isValid(phoneNumber, context));
    }

    @Test
    @DisplayName("Powinno zaakceptować null (walidacja @NotBlank obsługuje to)")
    void shouldAcceptNullValue() {
        assertTrue(validator.isValid(null, context));
    }

    @Test
    @DisplayName("Powinno zaakceptować pusty string (walidacja @NotBlank obsługuje to)")
    void shouldAcceptEmptyString() {
        assertTrue(validator.isValid("", context));
    }

    @Test
    @DisplayName("Powinno odrzucić numer bez prefiksu")
    void shouldRejectNumberWithoutPrefix() {
        assertFalse(validator.isValid("123456789", context));
    }

    @Test
    @DisplayName("Powinno odrzucić numer z niepolskim kodem kraju")
    void shouldRejectWithInvalidCountryCode() {
        assertFalse(validator.isValid("+12123456789", context));
    }
}

