package de.swtm.fuhrparkmanagement.controller;

import de.swtm.fuhrparkmanagement.api.ReservationsApi;
import de.swtm.fuhrparkmanagement.model.ReservationDto;
import de.swtm.fuhrparkmanagement.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReservationController implements ReservationsApi {

    private final ReservationService reservationService;

    @Override
    public ResponseEntity<ReservationDto> create(ReservationDto body) {
        return new ResponseEntity<>(reservationService.create(body), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<ReservationDto>> listAll() {
        return ResponseEntity.ok(reservationService.listAll());
    }

    @Override
    public ResponseEntity<ReservationDto> find(Long id) {
        return ResponseEntity.ok(reservationService.findById(id));
    }

    @Override
    public ResponseEntity<ReservationDto> update(Long id, ReservationDto body) {
        return ResponseEntity.ok(reservationService.updateById(id, body));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        reservationService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
