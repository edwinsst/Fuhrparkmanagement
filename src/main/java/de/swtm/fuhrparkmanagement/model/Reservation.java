package de.swtm.fuhrparkmanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@MappedSuperclass
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private String userId;

    @Column(columnDefinition = "TIMESTAMP default CURRENT_TIMESTAMP")
    private LocalDateTime createdDate;
}
