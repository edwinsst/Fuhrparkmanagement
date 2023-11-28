package de.swtm.fuhrparkmanagement.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    @JsonIncludeProperties("id")
    @JsonView(Views.WithoutId.class)
    private Car car;

    @JsonView(Views.WithoutId.class)
    private String startAddress;

    @JsonView(Views.WithoutId.class)
    private String destinationAddress;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonView(Views.WithoutId.class)
    private LocalDateTime startDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonView(Views.WithoutId.class)
    private LocalDateTime endDate;

    @JsonView(Views.WithoutId.class)
    private String purpose;

    public static class Views {

        public static class WithoutId {}
    }
}
