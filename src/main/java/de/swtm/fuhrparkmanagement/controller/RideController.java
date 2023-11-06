package de.swtm.fuhrparkmanagement.controller;

import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/ride")
@RequiredArgsConstructor
public class RideController {

    private final RideRepository rideRepository;

    @PostMapping("/create")
    public Ride create(@RequestBody @Valid Ride ride) {
        return rideRepository.save(ride);
    }

    @GetMapping("/list")
    public Iterable<Ride> listAll() {
        return rideRepository.findAll();
    }
}
