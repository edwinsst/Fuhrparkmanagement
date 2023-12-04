package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Ride extends TemporalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Car car;

    private String startAddress;

    private String destinationAddress;

    private OffsetDateTime startDate;

    private OffsetDateTime endDate;

    private String purpose;
}
