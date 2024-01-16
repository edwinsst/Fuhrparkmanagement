package de.swtm.fuhrparkmanagement;

import de.swtm.fuhrparkmanagement.exception.IllegalRideException;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.FuelType;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.model.RideDto;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import de.swtm.fuhrparkmanagement.service.RideService;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@SpringBootTest
public class RideServiceTests {

    private static final RideDto VALID_RIDE = new RideDto()
            .carId(1L)
            .startDate(OffsetDateTime.parse("2023-12-11T08:00:00+01:00"))
            .endDate(OffsetDateTime.parse("2023-12-11T19:00:00+01:00"))
            .startAddress("Stuttgart Feuerbach")
            .destinationAddress("Friedrichshafen")
            .purpose("Geschäftsausflug");

    private static final RideDto RIDE_WITH_INVALID_DATES = new RideDto()
            .carId(1L)
            .startDate(OffsetDateTime.parse("2023-12-11T19:00:00+01:00"))
            .endDate(OffsetDateTime.parse("2023-12-11T08:00:00+01:00"))
            .startAddress("Stuttgart Feuerbach")
            .destinationAddress("Friedrichshafen")
            .purpose("Geschäftsausflug");

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private RideService rideService;

    @MockBean
    private RideRepository rideRepository;

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
    void validRideShouldBeSaved() {
        Ride expectedRideEntity = convertToEntity(VALID_RIDE, testCar());

        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar()));
        when(rideRepository.save(expectedRideEntity)).thenReturn(expectedRideEntity);

        RideDto response = rideService.create(VALID_RIDE);

        assertThat(response).usingRecursiveComparison()
                .ignoringFields("id")
                .isEqualTo(VALID_RIDE);

        verify(rideRepository, times(1)).save(expectedRideEntity);
    }

    @Test
    void invalidRideShouldNotBeSaved() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar()));

        assertThrows(IllegalRideException.class, () -> rideService.create(RIDE_WITH_INVALID_DATES));
    }

    @Test
    void conflictingRideShouldNotBeSaved() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar()));

        RideDto newRide = new RideDto()
                .startDate(OffsetDateTime.parse("2023-12-11T18:00:00+01:00"))
                .endDate(OffsetDateTime.parse("2023-12-13T19:00:00+01:00"))
                .startAddress("Stuttgart Feuerbach")
                .destinationAddress("Friedrichshafen")
                .purpose("Einkaufen");

        assertThrows(IllegalRideException.class, () -> rideService.create(newRide));
    }

    private Ride convertToEntity(RideDto rideDto, Car car) {
        Ride ride = modelMapper.map(rideDto, Ride.class);
        ride.setCar(car);
        return ride;
    }
}
