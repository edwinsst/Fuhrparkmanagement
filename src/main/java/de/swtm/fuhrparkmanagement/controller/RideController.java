package de.swtm.fuhrparkmanagement.controller;

import com.fasterxml.jackson.annotation.JsonView;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideRepository rideRepository;
    private final CarRepository carRepository;

    @PostMapping
    public ResponseEntity<Ride> create(@RequestBody @Valid @JsonView(Ride.Views.WithoutId.class) Ride ride) {
        return ResponseEntity.of(carRepository.findById(ride.getCar().getId()).map(existingCar -> {
            ride.setCar(existingCar);
            return rideRepository.save(ride);
        }));
    }

    @GetMapping
    public Iterable<Ride> listAll() {
        return rideRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") long id) {
        Optional<Ride> ride = rideRepository.findById(id);
        if (ride.isPresent()) {
            rideRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ride> update(@PathVariable("id") long id,
                                       @RequestBody @Valid @JsonView(Ride.Views.WithoutId.class) Ride ride)
    {
        return ResponseEntity.of(rideRepository.findById(id).map(existingCar -> {
            ride.setId(id);
            return rideRepository.save(ride);
        }));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ride> find(@PathVariable("id") long id) {
        return ResponseEntity.of(rideRepository.findById(id));
    }
}
