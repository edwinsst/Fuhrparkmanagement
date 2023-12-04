package de.swtm.fuhrparkmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.swtm.fuhrparkmanagement.controller.CarController;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.FuelType;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.security.SecurityConfig;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CarController.class)
@WithMockUser
@ImportAutoConfiguration(SecurityConfig.class)
public class CarControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CarRepository carRepository;

    private Car testCar() {
        Car car = new Car();
        car.setId(1L);
        car.setLicensePlate("S-DS-123");
        car.setModelName("BMW 118i");
        car.setFuelType(FuelType.PETROL);
        car.setLocation("Stuttgart Feuerbach");
        car.setSeats(1);
        car.setRange(500);
        car.setAvailable(true);
        return car;
    }

    @Test
    void savedCarShouldBeListed() throws Exception {
        Car testCar = testCar();
        when(carRepository.findAll()).thenReturn(List.of(testCar));

        mockMvc.perform(get("/cars").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(testCar.getId()))
                .andExpect(jsonPath("$[0].licensePlate").value(testCar.getLicensePlate()))
                .andExpect(jsonPath("$[0].modelName").value(testCar.getModelName()))
                .andExpect(jsonPath("$[0].fuelType").value(testCar.getFuelType().name()))
                .andExpect(jsonPath("$[0].location").value(testCar.getLocation()))
                .andExpect(jsonPath("$[0].seats").value(testCar.getSeats()))
                .andExpect(jsonPath("$[0].range").value(testCar.getRange()))
                .andExpect(jsonPath("$[0].available").value(testCar.isAvailable()));

        verify(carRepository, times(1)).findAll();
    }

    @Test
    void savedCarShouldBeFound() throws Exception {
        Car testCar = testCar();
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar()));

        mockMvc.perform(get("/cars/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testCar.getId()))
                .andExpect(jsonPath("$.licensePlate").value(testCar.getLicensePlate()))
                .andExpect(jsonPath("$.modelName").value(testCar.getModelName()))
                .andExpect(jsonPath("$.fuelType").value(testCar.getFuelType().name()))
                .andExpect(jsonPath("$.location").value(testCar.getLocation()))
                .andExpect(jsonPath("$.seats").value(testCar.getSeats()))
                .andExpect(jsonPath("$.range").value(testCar.getRange()))
                .andExpect(jsonPath("$.available").value(testCar.isAvailable()));

        verify(carRepository, times(1)).findById(1L);
    }

    @Test
    void nonExistingCarShouldNotBeFound() throws Exception {
        when(carRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/cars/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(carRepository, times(1)).findById(1L);
    }

    @Test
    void validCarShouldBeCreated() throws Exception {
        Car testCar = testCar();
        when(carRepository.save(testCar)).thenReturn(testCar);

        mockMvc.perform(post("/cars").contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(testCar)))
                .andExpect(status().isCreated());

        verify(carRepository, times(1)).save(testCar);
    }

    @Test
    void incompleteCarCreateShouldBeRejected() throws Exception {
        String incompleteBody = """
                {
                  "modelName": "BMW 118i",
                  "fuelType": "PETROL",
                  "location": "Stuttgart Feuerbach",
                  "seats": 1,
                  "available": true
                }
                """;

        mockMvc.perform(post("/cars").contentType(MediaType.APPLICATION_JSON).content(incompleteBody))
                .andExpect(status().isBadRequest());

        verify(carRepository, never()).save(any());
    }

    @Test
    void invalidCarCreateShouldBeRejected() throws Exception {
        String invalidBody = """
                {
                  "licensePlate": "S-DS-123",
                  "modelName": "BMW 118i",
                  "fuelType": "PETROL",
                  "location": "Stuttgart Feuerbach",
                  "seats": 0,
                  "range": -100,
                  "available": true
                }
                """;

        mockMvc.perform(post("/cars").contentType(MediaType.APPLICATION_JSON).content(invalidBody))
                .andExpect(status().isBadRequest());

        verify(carRepository, never()).save(any());
    }

    @Test
    void validCarShouldBeUpdated() throws Exception {
        Car savedCar = testCar();

        Car updatedCar = testCar();
        updatedCar.setLocation("Karlsruhe");

        when(carRepository.findById(1L)).thenReturn(Optional.of(savedCar));
        when(carRepository.save(updatedCar)).thenReturn(updatedCar);

        mockMvc.perform(put("/cars/1").contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(updatedCar)))
                .andExpect(status().isOk());

        verify(carRepository, times(1)).findById(1L);
        verify(carRepository, times(1)).save(updatedCar);
    }

    @Test
    void validCarShouldBeDeleted() throws Exception {
        Car testCar = testCar();
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));

        mockMvc.perform(delete("/cars/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(carRepository, times(1)).findById(1L);
        verify(carRepository, times(1)).deleteById(1L);
    }
}
