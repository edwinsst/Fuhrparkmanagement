package de.swtm.fuhrparkmanagement.repository;

import de.swtm.fuhrparkmanagement.model.RideReservation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideReservationRepository extends CrudRepository<RideReservation, Long> {
}
