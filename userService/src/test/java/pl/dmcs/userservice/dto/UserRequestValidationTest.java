package pl.dmcs.userservice.dto;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.model.UserType;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("UserRequest DTO - Walidacja pól")
@Transactional
class UserRequestValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    private UserRequest createValidRequest() {
        UserRequest request = new UserRequest();
        request.setFirstName("Jan");
        request.setLastName("Kowalski");
        request.setEmail("jan@example.com");
        request.setPhoneNumber("+48123456789");
        request.setUserType(UserType.CUSTOMER);
        return request;
    }

    @Nested
    @DisplayName("firstName walidacja")
    class FirstNameValidation {

        @Test
        @DisplayName("firstName prawidłowy")
        void shouldBeValidWithCorrectFirstName() {
            UserRequest request = createValidRequest();
            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("firstName pusty")
        void shouldFailWhenFirstNameIsEmpty() {
            UserRequest request = createValidRequest();
            request.setFirstName("");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")));
        }

        @Test
        @DisplayName("firstName za krótki (<2)")
        void shouldFailWhenFirstNameTooShort() {
            UserRequest request = createValidRequest();
            request.setFirstName("A");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")));
        }

        @Test
        @DisplayName("firstName za długi (>100)")
        void shouldFailWhenFirstNameTooLong() {
            UserRequest request = createValidRequest();
            request.setFirstName("A".repeat(101));

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")));
        }
    }

    @Nested
    @DisplayName("email walidacja")
    class EmailValidation {

        @Test
        @DisplayName("email prawidłowy")
        void shouldBeValidWithCorrectEmail() {
            UserRequest request = createValidRequest();
            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("email bez @")
        void shouldFailWhenEmailInvalid() {
            UserRequest request = createValidRequest();
            request.setEmail("invalid.email");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        }

        @Test
        @DisplayName("email pusty")
        void shouldFailWhenEmailIsEmpty() {
            UserRequest request = createValidRequest();
            request.setEmail("");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        }
    }

    @Nested
    @DisplayName("phoneNumber walidacja")
    class PhoneNumberValidation {

        @Test
        @DisplayName("numer polski +48")
        void shouldBeValidWithPolishNumberPlus48() {
            UserRequest request = createValidRequest();
            request.setPhoneNumber("+48123456789");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("numer polski 0")
        void shouldBeValidWithPolishNumberZero() {
            UserRequest request = createValidRequest();
            request.setPhoneNumber("0123456789");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertFalse(violations.isEmpty());
        }

        @Test
        @DisplayName("numer nie polski")
        void shouldFailWhenNumberNotPolish() {
            UserRequest request = createValidRequest();
            request.setPhoneNumber("+33123456789");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phoneNumber")));
        }

        @Test
        @DisplayName("numer za krótki")
        void shouldFailWhenNumberTooShort() {
            UserRequest request = createValidRequest();
            request.setPhoneNumber("123456");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phoneNumber")));
        }

        @Test
        @DisplayName("numer pusty")
        void shouldFailWhenNumberIsEmpty() {
            UserRequest request = createValidRequest();
            request.setPhoneNumber("");

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("phoneNumber")));
        }
    }

    @Nested
    @DisplayName("userType walidacja")
    class UserTypeValidation {

        @Test
        @DisplayName("userType CUSTOMER")
        void shouldBeValidWithCustomerType() {
            UserRequest request = createValidRequest();
            request.setUserType(UserType.CUSTOMER);

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("userType COURIER")
        void shouldBeValidWithCourierType() {
            UserRequest request = createValidRequest();
            request.setUserType(UserType.COURIER);

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("userType null")
        void shouldFailWhenUserTypeIsNull() {
            UserRequest request = createValidRequest();
            request.setUserType(null);

            Set<ConstraintViolation<UserRequest>> violations = validator.validate(request);
            assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("userType")));
        }
    }
}

