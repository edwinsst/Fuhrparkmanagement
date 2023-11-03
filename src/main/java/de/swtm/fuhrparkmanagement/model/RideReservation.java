package de.swtm.fuhrparkmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class RideReservation extends Reservation {

    @ManyToOne
    private Ride ride;

}
