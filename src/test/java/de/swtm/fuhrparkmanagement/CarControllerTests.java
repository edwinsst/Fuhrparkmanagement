package de.swtm.fuhrparkmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.swtm.fuhrparkmanagement.controller.CarController;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.FuelType;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(CarController.class)
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

        mockMvc.perform(get("/cars/list").contentType(MediaType.APPLICATION_JSON))
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
    void validCarShouldBeCreated() throws Exception {
        Car testCar = testCar();
        mockMvc.perform(post("/cars/create").contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(testCar)))
                .andExpect(status().isOk());

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

        mockMvc.perform(post("/cars/create").contentType(MediaType.APPLICATION_JSON).content(incompleteBody))
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

        mockMvc.perform(post("/cars/create").contentType(MediaType.APPLICATION_JSON).content(invalidBody))
                .andExpect(status().isBadRequest());

        verify(carRepository, never()).save(any());
    }
}
