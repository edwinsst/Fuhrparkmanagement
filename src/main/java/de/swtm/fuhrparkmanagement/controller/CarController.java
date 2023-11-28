package de.swtm.fuhrparkmanagement.controller;

import com.fasterxml.jackson.annotation.JsonView;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarRepository carRepository;

    @PostMapping
    public Car create(@RequestBody @Valid @JsonView(Car.Views.WithoutId.class) Car car) {
        return carRepository.save(car);
    }

    @GetMapping
    public Iterable<Car> listAll() {
        return carRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        Optional<Car> car = carRepository.findById(id);
        if (car.isPresent()){
            carRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> update(@PathVariable("id") long id,
                                      @RequestBody @Valid @JsonView(Car.Views.WithoutId.class) Car car)
    {
        return ResponseEntity.of(carRepository.findById(id).map(existingCar -> {
            car.setId(id);
            return carRepository.save(car);
        }));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> find(@PathVariable("id") long id) {
        return ResponseEntity.of(carRepository.findById(id));
    }
}
