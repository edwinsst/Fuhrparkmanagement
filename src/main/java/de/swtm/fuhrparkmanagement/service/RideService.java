package de.swtm.fuhrparkmanagement.service;

import de.swtm.fuhrparkmanagement.exception.IllegalRideException;
import de.swtm.fuhrparkmanagement.exception.RideNotFoundException;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.Ride;
import de.swtm.fuhrparkmanagement.model.RideDto;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import de.swtm.fuhrparkmanagement.repository.RideRepository;
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

    public RideDto create(RideDto rideDto) {
        checkRideConditions(rideDto);
        Ride ride = convertToEntity(rideDto);
        return convertToDto(rideRepository.save(ride));
    }

    public List<RideDto> listAll() {
        List<RideDto> response = new ArrayList<>();
        rideRepository.findAll().forEach(ride -> response.add(convertToDto(ride)));
        return response;
    }

    public RideDto findById(long id) {
        return rideRepository.findById(id).map(this::convertToDto).orElseThrow(RideNotFoundException::new);
    }

    public RideDto updateById(long id, RideDto rideDto) {
        checkRideConditions(rideDto);
        Ride ride = convertToEntity(rideDto);
        rideRepository.findById(id).orElseThrow(RideNotFoundException::new);
        ride.setId(id);
        return convertToDto(rideRepository.save(ride));
    }

    public void deleteById(long id) {
        rideRepository.findById(id).orElseThrow(RideNotFoundException::new);
        rideRepository.deleteById(id);
    }

    private void checkRideConditions(RideDto rideDto) {
        if (rideDto.getEndDate().isBefore(rideDto.getStartDate())) {
            throw new IllegalRideException();
        }
        if (isRideConflictingWithOthers(rideDto)) {
            throw new IllegalRideException();
        }
    }

    private boolean isRideConflictingWithOthers(RideDto rideDto) {
        for (Ride ride : rideRepository.findAll()) {
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

    private boolean areDatesOverlapping(OffsetDateTime startDate1, OffsetDateTime endDate1,
                                           OffsetDateTime startDate2, OffsetDateTime endDate2)
    {
        return startDate1.isBefore(endDate2) && startDate2.isBefore(endDate1);
    }

    private Ride convertToEntity(RideDto rideDto) {
        Ride ride = modelMapper.map(rideDto, Ride.class);
        Car car = carRepository.findById(rideDto.getCarId()).orElseThrow(IllegalRideException::new);
        ride.setCar(car);
        return ride;
    }

    private RideDto convertToDto(Ride ride) {
        RideDto rideDto = modelMapper.map(ride, RideDto.class);
        rideDto.setCarId(ride.getCar().getId());
        return rideDto;
    }
}
