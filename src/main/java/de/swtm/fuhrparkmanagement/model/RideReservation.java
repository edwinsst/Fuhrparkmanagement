package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class RideReservation extends Reservation {

    @ManyToOne(optional = false)
    @JoinColumn(nullable = false)
    private Ride ride;

}
