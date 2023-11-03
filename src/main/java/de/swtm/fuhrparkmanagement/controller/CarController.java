package de.swtm.fuhrparkmanagement.controller;

import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarRepository carRepository;

    @PostMapping("/create")
    public Car create(@RequestBody @Valid Car car) {
        return carRepository.save(car);
    }

    @GetMapping("/list")
    public Iterable<Car> listAll() {
        return carRepository.findAll();
    }
}
