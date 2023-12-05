package de.swtm.fuhrparkmanagement.repository;

import de.swtm.fuhrparkmanagement.model.Ride;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RideRepository extends CrudRepository<Ride, Long> {
}
