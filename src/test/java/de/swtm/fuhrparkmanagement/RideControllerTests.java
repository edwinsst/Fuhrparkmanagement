package de.swtm.fuhrparkmanagement;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.swtm.fuhrparkmanagement.controller.RideController;
import de.swtm.fuhrparkmanagement.exception.RideNotFoundException;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.model.RideDto;
import de.swtm.fuhrparkmanagement.security.SecurityConfig;
import de.swtm.fuhrparkmanagement.service.RideService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RideController.class)
@WithMockUser
@ImportAutoConfiguration(SecurityConfig.class)
public class RideControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RideService rideService;

    private RideDto testRide() {
        return new RideDto()
            .carId(1L)
            .startDate(OffsetDateTime.parse("2023-12-11T08:00:00+01:00"))
            .endDate(OffsetDateTime.parse("2023-12-11T19:00:00+01:00"))
            .startAddress("Stuttgart Feuerbach")
            .destinationAddress("Friedrichshafen")
            .purpose("Geschäftsausflug");
    }

    @Test
    void savedRideShouldBeListed() throws Exception {
        RideDto testRide = testRide();
        when(rideService.listAll()).thenReturn(List.of(testRide));

        mockMvc.perform(get("/rides").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].carId").value(testRide.getCarId()))
                .andExpect(jsonPath("$[0].startDate").value(testRide.getStartDate()
                        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)))
                .andExpect(jsonPath("$[0].endDate").value(testRide.getEndDate()
                        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)))
                .andExpect(jsonPath("$[0].startAddress").value(testRide.getStartAddress()))
                .andExpect(jsonPath("$[0].destinationAddress").value(testRide.getDestinationAddress()))
                .andExpect(jsonPath("$[0].purpose").value(testRide.getPurpose()));

        verify(rideService, times(1)).listAll();
    }

    @Test
    void savedRideShouldBeFound() throws Exception {
        RideDto testRide = testRide();
        when(rideService.findById(1L)).thenReturn(testRide);

        mockMvc.perform(get("/rides/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.carId").value(testRide.getCarId()))
                .andExpect(jsonPath("$.startDate").value(testRide.getStartDate()
                        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)))
                .andExpect(jsonPath("$.endDate").value(testRide.getEndDate()
                        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)))
                .andExpect(jsonPath("$.startAddress").value(testRide.getStartAddress()))
                .andExpect(jsonPath("$.destinationAddress").value(testRide.getDestinationAddress()))
                .andExpect(jsonPath("$.purpose").value(testRide.getPurpose()));

        verify(rideService, times(1)).findById(1L);
    }

    @Test
    void nonExistingRideShouldNotBeFound() throws Exception {
        when(rideService.findById(1L)).thenThrow(RideNotFoundException.class);

        mockMvc.perform(get("/rides/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(rideService, times(1)).findById(1L);
    }
}
