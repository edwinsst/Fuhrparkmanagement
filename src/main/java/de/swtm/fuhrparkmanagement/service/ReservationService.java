package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.exception.IllegalReservationException;
import de.swtm.fuhrparkmanagement.exception.ReservationNotFoundException;
import de.swtm.fuhrparkmanagement.model.ReservationDto;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.model.RideReservation;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import de.swtm.fuhrparkmanagement.repository.RideReservationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ModelMapper modelMapper;

    private final RideReservationRepository rideReservationRepository;

    private final RideRepository rideRepository;

    private final EmailService emailService;

    public ReservationDto create(ReservationDto reservationDto) {
        checkReservationValidations(reservationDto);
        RideReservation rideReservation = convertToEntity(reservationDto);
        try {
            emailService.sendNewReservationEmail(rideReservation);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return convertToDto(rideReservationRepository.save(rideReservation));
    }

    public List<ReservationDto> listAll() {
        List<ReservationDto> response = new ArrayList<>();
        for (RideReservation rideReservation : rideReservationRepository.findAll()) {
            if (rideReservation.getDeletedDate() == null) {
                response.add(convertToDto(rideReservation));
            }
        }
        return response;
    }

    public ReservationDto findById(long id) {
        return rideReservationRepository.findById(id).map(this::convertToDto)
                .orElseThrow(ReservationNotFoundException::new);
    }

    public ReservationDto updateById(long id, ReservationDto reservationDto) {
        checkReservationValidations(reservationDto);
        checkIfReservationWithIdExists(id);
        RideReservation rideReservation = convertToEntity(reservationDto);
        rideReservation.setId(id);
        return convertToDto(rideReservationRepository.save(rideReservation));
    }

    public void deleteById(long id) {
        RideReservation rideReservation = rideReservationRepository.findById(id)
                .orElseThrow(ReservationNotFoundException::new);
        rideReservation.setDeletedDate(OffsetDateTime.now());
        rideReservationRepository.save(rideReservation);
    }

    private void checkIfReservationWithIdExists(long id) {
        rideReservationRepository.findById(id).orElseThrow(ReservationNotFoundException::new);
    }

    private void checkReservationValidations(ReservationDto reservationDto) {
        if (hasUserAlreadyReservationForRide(reservationDto.getUserId(), reservationDto.getRideId())) {
            throw new IllegalReservationException();
        }
    }

    private boolean hasUserAlreadyReservationForRide(String userId, long rideId) {
        for (RideReservation rideReservation : rideReservationRepository.findAll()) {
            if (rideReservation.getUserId().equals(userId) && rideReservation.getRide().getId() == rideId) {
                return true;
            }
        }
        return false;
    }

    private RideReservation convertToEntity(ReservationDto reservationDto) {
        RideReservation rideReservation = modelMapper.map(reservationDto, RideReservation.class);
        Ride ride = rideRepository.findById(reservationDto.getRideId()).orElseThrow(IllegalReservationException::new);
        if (ride.getDeletedDate() != null) {
            throw new IllegalReservationException();
        }
        rideReservation.setRide(ride);
        return rideReservation;
    }

    private ReservationDto convertToDto(RideReservation rideReservation) {
        ReservationDto reservationDto = modelMapper.map(rideReservation, ReservationDto.class);
        reservationDto.setRideId(rideReservation.getRide().getId());
        return reservationDto;
    }
}
