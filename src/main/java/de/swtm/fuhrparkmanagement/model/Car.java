package de.swtm.fuhrparkmanagement.model;

import com.fasterxml.jackson.annotation.JsonView;
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
    @JsonView(Views.WithoutId.class)
    private String licensePlate;

    // TODO: Size validation
    @JsonView(Views.WithoutId.class)
    private String modelName;

    @JsonView(Views.WithoutId.class)
    private FuelType fuelType;

    @JsonView(Views.WithoutId.class)
    private String location;

    @Min(1)
    @JsonView(Views.WithoutId.class)
    private int seats;

    @Min(1)
    @JsonView(Views.WithoutId.class)
    private int range;

    @JsonView(Views.WithoutId.class)
    private boolean available;

    public static class Views {

        public static class WithoutId {}
    }
}
