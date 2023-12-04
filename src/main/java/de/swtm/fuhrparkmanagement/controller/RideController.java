package de.swtm.fuhrparkmanagement.controller;

import de.swtm.fuhrparkmanagement.api.RidesApi;
import de.swtm.fuhrparkmanagement.model.RideDto;
import de.swtm.fuhrparkmanagement.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RideController implements RidesApi {

    private final RideService rideService;

    @Override
    public ResponseEntity<RideDto> create(RideDto body) {
        return new ResponseEntity<>(rideService.create(body), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<RideDto>> listAll() {
        return ResponseEntity.ok(rideService.listAll());
    }

    @Override
    public ResponseEntity<RideDto> find(Long id) {
        return ResponseEntity.ok(rideService.findById(id));
    }

    @Override
    public ResponseEntity<RideDto> update(Long id, RideDto body) {
        return ResponseEntity.ok(rideService.updateById(id, body));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        rideService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
