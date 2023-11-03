package de.swtm.fuhrparkmanagement.repository;

import de.swtm.fuhrparkmanagement.model.Car;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends CrudRepository<Car, Long> {
}
