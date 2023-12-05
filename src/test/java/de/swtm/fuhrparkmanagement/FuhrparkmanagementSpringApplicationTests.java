package de.swtm.fuhrparkmanagement;

import static org.assertj.core.api.Assertions.assertThat;

import de.swtm.fuhrparkmanagement.controller.CarController;
import de.swtm.fuhrparkmanagement.controller.RideController;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import de.swtm.fuhrparkmanagement.service.RideService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FuhrparkmanagementSpringApplicationTests {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarController carController;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private RideService rideService;

    @Autowired
    private RideController rideController;

    @Test
    void contextLoads() {
        assertThat(carRepository).isNotNull();
        assertThat(carController).isNotNull();
        assertThat(rideRepository).isNotNull();
        assertThat(rideService).isNotNull();
        assertThat(rideController).isNotNull();
    }

}
