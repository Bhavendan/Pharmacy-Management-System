package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.entity.Prescription;
import com.hospital.pharmacy.enums.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByDoctorId(Long doctorId);
    Optional<Prescription> findByPrescriptionNumber(String prescriptionNumber);
    boolean existsByPrescriptionNumber(String prescriptionNumber);
    long countByStatus(PrescriptionStatus status);
    List<Prescription> findByStatus(PrescriptionStatus status);
}
