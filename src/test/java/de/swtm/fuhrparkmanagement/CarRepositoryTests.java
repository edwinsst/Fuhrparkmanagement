package de.swtm.fuhrparkmanagement;

import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.FuelType;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class CarRepositoryTests {

    @Autowired
    private CarRepository carRepository;

    private Car testCar() {
        Car car = new Car();
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
    @Order(1)
    @Rollback(false)
    void carShouldBeSaved() {
        Car savedCar = carRepository.save(testCar());
        assertThat(savedCar.getId()).isGreaterThan(0);
    }

    @Test
    @Order(2)
    void savedCarShouldFoundWithId() {
        Car savedCar = carRepository.findById(1L).orElseThrow();
        assertThat(savedCar).usingRecursiveComparison()
                .ignoringFields("id", "createdDate")
                .isEqualTo(testCar());
    }

    @Test
    @Order(3)
    void savedCarShouldBeFoundWhenFindingAll() {
        Iterable<Car> savedCars = carRepository.findAll();
        assertThat(savedCars).isNotEmpty();
        assertThat(savedCars).element(0).usingRecursiveComparison()
                .ignoringFields("id", "createdDate")
                .isEqualTo(testCar());
    }

    @Test
    @Order(4)
    void savedCarShouldBeUpdated() {
        Car savedCar = carRepository.findById(1L).orElseThrow();
        savedCar.setLocation("Karlsruhe");
        savedCar = carRepository.save(savedCar);
        assertThat(savedCar.getLocation()).isEqualTo("Karlsruhe");
    }

    @Test
    @Order(5)
    void savedCarShouldBeDeleted() {
        Car savedCar = carRepository.findById(1L).orElseThrow();
        carRepository.delete(savedCar);

        Optional<Car> nonExistingCar = carRepository.findById(1L);
        assertThat(nonExistingCar).isEmpty();
    }
}
