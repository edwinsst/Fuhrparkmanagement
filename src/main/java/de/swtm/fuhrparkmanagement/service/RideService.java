package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.exception.IllegalRideException;
import de.swtm.fuhrparkmanagement.exception.RideNotFoundException;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.model.RideDto;
import de.swtm.fuhrparkmanagement.model.RideReservation;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
import de.swtm.fuhrparkmanagement.repository.RideReservationRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class RideService {

    private final ModelMapper modelMapper;

    private final CarRepository carRepository;

    private final RideRepository rideRepository;

    private final RideReservationRepository rideReservationRepository;

    private final EmailService emailService;

    public RideDto create(RideDto rideDto) {
        checkRideValidations(rideDto);
        Ride ride = convertToEntity(rideDto);
        return convertToDto(rideRepository.save(ride));
    }

    public List<RideDto> listAll() {
        return getNonDeletedRides().stream().map(this::convertToDto).toList();
    }

    public RideDto findById(long id) {
        return rideRepository.findById(id).map(this::convertToDto).orElseThrow(RideNotFoundException::new);
    }

    public RideDto updateById(long id, RideDto rideDto) {
        checkRideValidations(rideDto, id);
        checkIfRideWithIdExists(id);
        Ride ride = convertToEntity(rideDto);
        ride.setId(id);
        ride = rideRepository.save(ride);
        for (RideReservation rideReservation : rideReservationRepository.findAll()) {
            if (rideReservation.getDeletedDate() == null && rideReservation.getRide().getId() == id) {
                try {
                    emailService.sendUpdateReservationEmail(rideReservation);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return convertToDto(ride);
    }

    public void deleteById(long id) {
        Ride ride = rideRepository.findById(id).orElseThrow(RideNotFoundException::new);
        ride.setDeletedDate(OffsetDateTime.now());
        rideRepository.save(ride);
    }

    private void checkIfRideWithIdExists(long id) {
        rideRepository.findById(id).orElseThrow(RideNotFoundException::new);
    }

    private void checkRideValidations(RideDto rideDto) {
        if (rideDto.getEndDate().isBefore(rideDto.getStartDate())) {
            throw new IllegalRideException();
        }
        if (isRideConflictingWithOthers(rideDto)) {
            throw new IllegalRideException();
        }
    }

    private void checkRideValidations(RideDto rideDto, long id) {
        if (rideDto.getEndDate().isBefore(rideDto.getStartDate())) {
            throw new IllegalRideException();
        }
        if (isRideConflictingWithOthers(rideDto, id)) {
            throw new IllegalRideException();
        }
    }

    private boolean isRideConflictingWithOthers(RideDto rideDto) {
        for (Ride ride : getNonDeletedRides()) {
            if (!Objects.equals(ride.getCar().getId(), rideDto.getCarId())) {
                continue;
            }
            if (areDatesOverlapping(rideDto.getStartDate(), rideDto.getEndDate(),
                    ride.getStartDate(), ride.getEndDate())) {
                return true;
            }
        }
        return false;
    }

    private boolean isRideConflictingWithOthers(RideDto rideDto, long ignoringId) {
        for (Ride ride : getNonDeletedRides()) {
            if (ride.getId() == ignoringId) {
                continue;
            }
            if (!Objects.equals(ride.getCar().getId(), rideDto.getCarId())) {
                continue;
            }
            if (areDatesOverlapping(rideDto.getStartDate(), rideDto.getEndDate(),
                    ride.getStartDate(), ride.getEndDate())) {
                return true;
            }
        }
        return false;
    }

    private List<Ride> getNonDeletedRides() {
        List<Ride> result = new ArrayList<>();
        for (Ride ride : rideRepository.findAll()) {
            if (ride.getDeletedDate() == null) {
                result.add(ride);
            }
        }
        return result;
    }

    private boolean areDatesOverlapping(OffsetDateTime startDate1, OffsetDateTime endDate1,
                                           OffsetDateTime startDate2, OffsetDateTime endDate2)
    {
        return startDate1.isBefore(endDate2) && startDate2.isBefore(endDate1);
    }

    private Ride convertToEntity(RideDto rideDto) {
        Ride ride = modelMapper.map(rideDto, Ride.class);
        Car car = carRepository.findById(rideDto.getCarId()).orElseThrow(IllegalRideException::new);
        if (car.getDeletedDate() != null) {
            throw new IllegalRideException();
        }
        ride.setCar(car);
        return ride;
    }

    private RideDto convertToDto(Ride ride) {
        RideDto rideDto = modelMapper.map(ride, RideDto.class);
        rideDto.setCarId(ride.getCar().getId());
        return rideDto;
    }
}
