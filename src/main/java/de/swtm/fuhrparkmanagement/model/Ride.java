package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Entity
public class Ride {

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
