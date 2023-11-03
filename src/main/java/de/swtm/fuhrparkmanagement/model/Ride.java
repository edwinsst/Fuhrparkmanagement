package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Car car;

    private String startAddress;

    private String destinationAddress;

    // @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime startDate;

    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime endDate;

    private String purpose;
}
