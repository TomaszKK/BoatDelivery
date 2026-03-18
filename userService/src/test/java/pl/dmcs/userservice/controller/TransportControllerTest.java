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
import pl.dmcs.userservice.dto.request.TransportRequest;
import pl.dmcs.userservice.dto.request.UserRequest;
import pl.dmcs.userservice.model.UserType;
import pl.dmcs.userservice.test.TestDataGenerator;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("TransportController - Testy REST API")
class TransportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private TransportRequest validTransportRequest;
    private String courierId;

    @BeforeEach
    void setUp() throws Exception {
        UserRequest courierRequest = TestDataGenerator.generateValidCourierRequest();

        var response = mockMvc.perform(post("/api/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(courierRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        courierId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        validTransportRequest = TestDataGenerator.generateValidTransportRequest();
    }

    @Nested
    @DisplayName("POST /api/transport/courier/{courierId} - Tworzenie transportu")
    class CreateTransportTests {

        @Test
        @DisplayName("Powinno utworzyć transport dla prawidłowego kuriera")
        void shouldCreateTransportForValidCourier() throws Exception {
            mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").isString())
                    .andExpect(jsonPath("$.courierId").value(courierId))
                    .andExpect(jsonPath("$.transportType").value(validTransportRequest.getTransportType().toString()))
                    .andExpect(jsonPath("$.brand").value(validTransportRequest.getBrand()))
                    .andExpect(jsonPath("$.model").value(validTransportRequest.getModel()))
                    .andExpect(jsonPath("$.trunkVolume").value(validTransportRequest.getTrunkVolume()));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy transportType jest null")
        void shouldReturn400WhenTransportTypeIsNull() throws Exception {
            validTransportRequest.setTransportType(null);

            mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("transportType"));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy brand jest pusty")
        void shouldReturn400WhenBrandIsEmpty() throws Exception {
            validTransportRequest.setBrand("");

            mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[0].field").value("brand"));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy trunkVolume <= 0")
        void shouldReturn400WhenTrunkVolumeIsZero() throws Exception {
            validTransportRequest.setTrunkVolume(0.0);

            mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("trunkVolume")))
                    .andExpect(jsonPath("$.fieldErrors[*].message", hasItem(containsString("większa od 0"))));
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy cargoCapacity <= 0")
        void shouldReturn400WhenCargoCapacityIsNegative() throws Exception {
            validTransportRequest.setCargoCapacity(-100.0);

            mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("cargoCapacity")));
        }

        @Test
        @DisplayName("Powinno zwrócić 404 gdy kurier nie istnieje")
        void shouldReturn404WhenCourierNotFound() throws Exception {
            mockMvc.perform(post("/api/transport/courier/" + UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Powinno zwrócić 400 gdy użytkownik nie jest kurierem")
        void shouldReturn400WhenUserIsNotCourier() throws Exception {
            UserRequest customerRequest = TestDataGenerator.generateValidUserRequest(UserType.CUSTOMER);

            var response = mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(customerRequest)))
                    .andExpect(status().isCreated())
                    .andReturn();

            String customerId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();

            mockMvc.perform(post("/api/transport/courier/" + customerId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.error").value("Invalid Operation"));
        }
    }

    @Nested
    @DisplayName("GET /api/transport - Pobieranie transportów")
    class GetTransportTests {

        private String transportId;

        @BeforeEach
        void createTransport() throws Exception {
            var response = mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isCreated())
                    .andReturn();

            transportId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno pobrać listę wszystkich transportów")
        void shouldGetAllTransports() throws Exception {
            mockMvc.perform(get("/api/transport"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", isA(List.class)));
        }

        @Test
        @DisplayName("Powinno pobrać transport po ID")
        void shouldGetTransportById() throws Exception {
            mockMvc.perform(get("/api/transport/" + transportId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(transportId))
                    .andExpect(jsonPath("$.brand").value(validTransportRequest.getBrand()))
                    .andExpect(jsonPath("$.courierId").value(courierId));
        }

        @Test
        @DisplayName("Powinno pobrać transporty konkretnego kuriera")
        void shouldGetTransportsByCourierId() throws Exception {
            mockMvc.perform(get("/api/transport/courier/" + courierId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", isA(List.class)))
                    .andExpect(jsonPath("$[0].courierId").value(courierId));
        }

        @Test
        @DisplayName("Powinno zwrócić 404 gdy transport nie istnieje")
        void shouldReturn404WhenTransportNotFound() throws Exception {
            mockMvc.perform(get("/api/transport/" + UUID.randomUUID()))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.error").value("Resource Not Found"));
        }
    }

    @Nested
    @DisplayName("PUT /api/transport/{id} - Aktualizacja transportu")
    class UpdateTransportTests {

        private String transportId;

        @BeforeEach
        void createTransport() throws Exception {
            var response = mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isCreated())
                    .andReturn();

            transportId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno zaktualizować transport")
        void shouldUpdateTransport() throws Exception {
            validTransportRequest.setColor("czarny");
            validTransportRequest.setConsumption(9.2);

            mockMvc.perform(put("/api/transport/" + transportId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.color").value("czarny"))
                    .andExpect(jsonPath("$.consumption").value(9.2));
        }

        @Test
        @DisplayName("Powinno zwrócić 404 gdy transport nie istnieje")
        void shouldReturn404WhenTransportNotFound() throws Exception {
            mockMvc.perform(put("/api/transport/" + UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("DELETE /api/transport/{id} - Usunięcie transportu")
    class DeleteTransportTests {

        private String transportId;

        @BeforeEach
        void createTransport() throws Exception {
            var response = mockMvc.perform(post("/api/transport/courier/" + courierId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validTransportRequest)))
                    .andExpect(status().isCreated())
                    .andReturn();

            transportId = objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();
        }

        @Test
        @DisplayName("Powinno usunąć transport (204 No Content)")
        void shouldDeleteTransport() throws Exception {
            mockMvc.perform(delete("/api/transport/" + transportId))
                    .andExpect(status().isNoContent());

            mockMvc.perform(get("/api/transport/" + transportId))
                    .andExpect(status().isNotFound());
        }
    }
}

