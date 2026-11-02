package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientCode(String patientCode);
    boolean existsByPatientCode(String patientCode);
    List<Patient> findByNameContainingIgnoreCaseOrPatientCodeContainingIgnoreCase(String name, String patientCode);
}
