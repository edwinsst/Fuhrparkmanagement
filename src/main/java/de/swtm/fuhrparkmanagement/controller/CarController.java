package de.swtm.fuhrparkmanagement.controller;

import de.swtm.fuhrparkmanagement.api.CarsApi;
import de.swtm.fuhrparkmanagement.exception.CarNotFoundException;
import de.swtm.fuhrparkmanagement.model.Car;
import de.swtm.fuhrparkmanagement.model.CarDto;
import de.swtm.fuhrparkmanagement.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CarController implements CarsApi {

    private final ModelMapper modelMapper;

    private final CarRepository carRepository;

    @Override
    public ResponseEntity<CarDto> create(CarDto body) {
        Car savedCar = carRepository.save(convertToEntity(body));
        return new ResponseEntity<>(convertToDto(savedCar), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<CarDto>> listAll() {
        List<CarDto> response = new ArrayList<>();
        carRepository.findAll().forEach(car -> response.add(convertToDto(car)));
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<CarDto> find(Long id) {
        Car car = carRepository.findById(id).orElseThrow(CarNotFoundException::new);
        return ResponseEntity.ok(convertToDto(car));
    }

    @Override
    public ResponseEntity<CarDto> update(Long id, CarDto body) {
        carRepository.findById(id).orElseThrow(CarNotFoundException::new);
        Car newCar = convertToEntity(body);
        newCar.setId(id);
        return ResponseEntity.ok(convertToDto(carRepository.save(newCar)));
    }

    @Override
    public ResponseEntity<Void> delete(Long id) {
        Car car = carRepository.findById(id).orElseThrow(CarNotFoundException::new);
        car.setDeletedDate(OffsetDateTime.now());
        carRepository.save(car);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Car convertToEntity(CarDto carDto) {
        return modelMapper.map(carDto, Car.class);
    }

    private CarDto convertToDto(Car car) {
        return modelMapper.map(car, CarDto.class);
    }
}
