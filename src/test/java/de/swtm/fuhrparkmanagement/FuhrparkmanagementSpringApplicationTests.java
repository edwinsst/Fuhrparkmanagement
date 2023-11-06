package de.swtm.fuhrparkmanagement;

import static org.assertj.core.api.Assertions.assertThat;

import de.swtm.fuhrparkmanagement.controller.CarController;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class FuhrparkmanagementSpringApplicationTests {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarController carController;

    @Test
    void contextLoads() {
        assertThat(carRepository).isNotNull();
        assertThat(carController).isNotNull();
    }

}
