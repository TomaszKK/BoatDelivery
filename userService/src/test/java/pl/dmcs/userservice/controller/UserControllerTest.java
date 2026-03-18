package pl.dmcs.userservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import pl.dmcs.userservice.dto.request.UpdateUserRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.test.TestDataGenerator;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("UserController - Testy REST API")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private UserRequest validUserRequest;

    @BeforeEach
    void setUp() {
        validUserRequest = TestDataGenerator.generateValidCustomerRequest();
    }

    @Nested
    @DisplayName("POST /api/user - Tworzenie użytkownika")
    class CreateUserTests {

        @Test
        @DisplayName("Powinno utworzyć użytkownika z prawidłowymi danymi")
        void shouldCreateUserWithValidData() throws Exception {
            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").isString())
                    .andExpect(jsonPath("$.firstName").value(validUserRequest.getFirstName()))
                    .andExpect(jsonPath("$.lastName").value(validUserRequest.getLastName()))
                    .andExpect(jsonPath("$.email").value(validUserRequest.getEmail()))
                    .andExpect(jsonPath("$.phoneNumber").value(validUserRequest.getPhoneNumber()))
                    .andExpect(jsonPath("$.userType").value(validUserRequest.getUserType().toString()));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy firstName ma <2 znaki")
        void shouldReturn400WhenFirstNameTooShort() throws Exception {
            validUserRequest.setFirstName("A");

            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("firstName")))
                    .andExpect(jsonPath("$.fieldErrors[*].message", hasItem(containsString("2 do 100"))));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy email jest nieprawidłowy")
        void shouldReturn400WhenEmailIsInvalid() throws Exception {
            validUserRequest.setEmail("invalid-email");

            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("email"))
                    .andExpect(jsonPath("$.fieldErrors[0].message").value("Email musi być prawidłowy"));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy numer telefonu jest nieprawidłowy")
        void shouldReturn400WhenPhoneNumberIsInvalid() throws Exception {
            validUserRequest.setPhoneNumber("123456");

            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("phoneNumber"))
                    .andExpect(jsonPath("$.fieldErrors[0].message").value("Numer telefonu musi być prawidłowym polskim numerem (+48 lub 0 i 9 cyfr)"));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy numer telefonu nie polski")
        void shouldReturn400WhenPhoneNumberNotPolish() throws Exception {
            validUserRequest.setPhoneNumber("+33123456789");

            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("phoneNumber"));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy userType jest null")
        void shouldReturn400WhenUserTypeIsNull() throws Exception {
            validUserRequest.setUserType(null);

            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("userType"));
        }
    }

    @Nested
    @DisplayName("GET /api/user - Pobieranie użytkowników")
    class GetUserTests {

        private String userId;
        private UserRequest request;

        @BeforeEach
        void createUser() throws Exception {
            request = TestDataGenerator.generateValidCustomerRequest();

            var response = mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andReturn();

            userId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno pobrać listę wszystkich użytkowników")
        void shouldGetAllUsers() throws Exception {
            mockMvc.perform(get("/api/user"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", isA(List.class)))
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
        }

        @Test
        @DisplayName("Powinno pobrać użytkownika po ID")
        void shouldGetUserById() throws Exception {
            mockMvc.perform(get("/api/user/" + userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(userId))
                    .andExpect(jsonPath("$.firstName").value(request.getFirstName()))
                    .andExpect(jsonPath("$.userType").value(request.getUserType().toString()));
        }

        @Test
        @DisplayName("Powinno zwrócić 404 gdy użytkownik nie istnieje")
        void shouldReturn404WhenUserNotFound() throws Exception {
            mockMvc.perform(get("/api/user/" + UUID.randomUUID()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.error").value("Resource Not Found"))
                    .andExpect(jsonPath("$.message").value(containsString("User")));
        }
    }

    @Nested
    @DisplayName("PUT /api/user/{id} - Aktualizacja użytkownika")
    class UpdateUserTests {

        private String userId;

        @BeforeEach
        void createUser() throws Exception {
            UserRequest request = TestDataGenerator.generateValidCustomerRequest();

            var response = mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andReturn();

            userId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno zaktualizować użytkownika (PUT)")
        void shouldUpdateUser() throws Exception {
            UserRequest updateRequest = TestDataGenerator.generateValidCustomerRequest();
            updateRequest.setFirstName("Anna");
            updateRequest.setLastName("Nowak");

            mockMvc.perform(put("/api/user/" + userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("Anna"))
                    .andExpect(jsonPath("$.lastName").value("Nowak"));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy dane walidacji są nieprawidłowe")
        void shouldReturn400OnInvalidUpdate() throws Exception {
            validUserRequest.setEmail("invalid");

            mockMvc.perform(put("/api/user/" + userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("email"));
        }

        @Test
        @DisplayName("Powinno zwrócić 404 gdy użytkownik nie istnieje")
        void shouldReturn404WhenUserNotFound() throws Exception {
            mockMvc.perform(put("/api/user/" + UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validUserRequest)))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("PATCH /api/user/{id} - Częściowa aktualizacja")
    class PatchUserTests {

        private String userId;

        @BeforeEach
        void createUser() throws Exception {
            UserRequest request = TestDataGenerator.generateValidCustomerRequest();

            var response = mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andReturn();

            userId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno zaktualizować tylko firstName (PATCH)")
        void shouldPartiallyUpdateUser() throws Exception {
            UpdateUserRequest partialRequest = new UpdateUserRequest();
            partialRequest.setFirstName("Marian");

            mockMvc.perform(patch("/api/user/" + userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(partialRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("Marian"))
                    .andExpect(jsonPath("$.lastName").isNotEmpty());
        }
    }

    @Nested
    @DisplayName("DELETE /api/user/{id} - Usunięcie użytkownika")
    class DeleteUserTests {

        private String userId;

        @BeforeEach
        void createUser() throws Exception {
            UserRequest request = TestDataGenerator.generateValidCustomerRequest();

            var response = mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andReturn();

            userId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno usunąć użytkownika (204 No Content)")
        void shouldDeleteUser() throws Exception {
            mockMvc.perform(delete("/api/user/" + userId))
                    .andExpect(status().isNoContent());

            mockMvc.perform(get("/api/user/" + userId))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Powinno zwrócić 404 gdy użytkownik nie istnieje")
        void shouldReturn404WhenUserNotFound() throws Exception {
            mockMvc.perform(delete("/api/user/" + UUID.randomUUID()))
                    .andExpect(status().isNotFound());
        }
    }
}