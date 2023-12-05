package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Data
@MappedSuperclass
public class TemporalEntity {

    @CreationTimestamp
    private OffsetDateTime createdDate;

    private OffsetDateTime deletedDate;
}
