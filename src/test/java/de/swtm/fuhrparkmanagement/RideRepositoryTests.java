package de.swtm.fuhrparkmanagement;

import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.FuelType;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.time.OffsetDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RideRepositoryTests {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private RideRepository rideRepository;

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

    private Ride testRide() {
        Ride ride = new Ride();
        ride.setCar(testCar());
        ride.setStartDate(OffsetDateTime.parse("2023-12-11T08:00:00+01:00"));
        ride.setEndDate(OffsetDateTime.parse("2023-12-11T19:00:00+01:00"));
        ride.setStartAddress("Stuttgart Feuerbach");
        ride.setDestinationAddress("Friedrichshafen");
        ride.setPurpose("Geschäftsausflug");
        return ride;
    }

    @Test
    @Order(1)
    @Rollback(false)
    void rideShouldBeSaved() {
        carRepository.save(testCar());

        Ride ride = rideRepository.save(testRide());
        assertThat(ride.getId()).isGreaterThan(0);
    }

    @Test
    @Order(2)
    void savedRideShouldBeFoundWithId() {
        Ride savedRide = rideRepository.findById(1L).orElseThrow();
        assertThat(savedRide).usingRecursiveComparison()
                .ignoringFields("id", "createdDate", "car.createdDate")
                .isEqualTo(testRide());
    }

    @Test
    @Order(3)
    void savedRideShouldBeFoundWhenFindingAll() {
        Iterable<Ride> savedRides = rideRepository.findAll();
        assertThat(savedRides).isNotEmpty();
        assertThat(savedRides).element(0).usingRecursiveComparison()
                .ignoringFields("id", "createdDate", "car.createdDate")
                .isEqualTo(testRide());
    }

    @Test
    @Order(4)
    void savedRideShouldBeUpdated() {
        Ride savedRide = rideRepository.findById(1L).orElseThrow();
        savedRide.setDestinationAddress("Karlsruhe");
        savedRide = rideRepository.save(savedRide);
        assertThat(savedRide.getDestinationAddress()).isEqualTo("Karlsruhe");
    }

    @Test
    @Order(5)
    void savedRideShouldBeDeleted() {
        Ride savedRide = rideRepository.findById(1L).orElseThrow();
        rideRepository.delete(savedRide);

        assertThat(rideRepository.findById(1L)).isEmpty();
    }
}
