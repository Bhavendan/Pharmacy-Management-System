package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.PatientRequest;
import com.hospital.pharmacy.dto.PatientResponse;
import com.hospital.pharmacy.entity.Patient;
import com.hospital.pharmacy.exception.DuplicateResourceException;
import com.hospital.pharmacy.exception.ResourceNotFoundException;
import com.hospital.pharmacy.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    @Transactional
    public PatientResponse createPatient(PatientRequest request) {
        if (patientRepository.existsByPatientCode(request.getPatientCode())) {
            throw new DuplicateResourceException("Patient", "patientCode", request.getPatientCode());
        }

        Patient patient = Patient.builder()
                .patientCode(request.getPatientCode())
                .name(request.getName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phone(request.getPhone())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .allergies(request.getAllergies())
                .build();

        return mapToResponse(patientRepository.save(patient));
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        return mapToResponse(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PatientResponse updatePatient(Long id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));

        if (!patient.getPatientCode().equals(request.getPatientCode()) && patientRepository.existsByPatientCode(request.getPatientCode())) {
            throw new DuplicateResourceException("Patient", "patientCode", request.getPatientCode());
        }

        patient.setPatientCode(request.getPatientCode());
        patient.setName(request.getName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setAddress(request.getAddress());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());

        return mapToResponse(patientRepository.save(patient));
    }

    @Transactional
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient", "id", id);
        }
        patientRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PatientResponse> searchPatients(String query) {
        if (query == null || query.isBlank()) {
            return getAllPatients();
        }
        return patientRepository.findByNameContainingIgnoreCaseOrPatientCodeContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PatientResponse mapToResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .patientCode(patient.getPatientCode())
                .name(patient.getName())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .bloodGroup(patient.getBloodGroup())
                .allergies(patient.getAllergies())
                .createdAt(patient.getCreatedAt())
                .build();
    }
}
