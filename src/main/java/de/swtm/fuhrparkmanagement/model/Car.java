package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Entity
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Regex for validation
    private String licensePlate;

    // TODO: Size validation
    private String modelName;

    private FuelType fuelType;

    private String location;

    @Min(1)
    private int seats;

    @Min(1)
    private int range;

    private boolean available;
}
