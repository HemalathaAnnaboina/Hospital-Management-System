package com.hospital.repository;

import com.hospital.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByActiveTrueOrderByNameAsc();
    List<Medicine> findByNameContainingIgnoreCaseAndActiveTrue(String name);
    Optional<Medicine> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
