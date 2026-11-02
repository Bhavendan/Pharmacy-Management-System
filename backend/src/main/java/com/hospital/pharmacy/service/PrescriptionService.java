package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.PrescriptionItemRequest;
import com.hospital.pharmacy.dto.PrescriptionItemResponse;
import com.hospital.pharmacy.dto.PrescriptionRequest;
import com.hospital.pharmacy.dto.PrescriptionResponse;
import com.hospital.pharmacy.entity.*;
import com.hospital.pharmacy.enums.PrescriptionStatus;
import com.hospital.pharmacy.exception.DuplicateResourceException;
import com.hospital.pharmacy.exception.InvalidPrescriptionException;
import com.hospital.pharmacy.exception.ResourceNotFoundException;
import com.hospital.pharmacy.repository.DrugRepository;
import com.hospital.pharmacy.repository.PatientRepository;
import com.hospital.pharmacy.repository.PrescriptionRepository;
import com.hospital.pharmacy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DrugRepository drugRepository;
    private final InventoryService inventoryService;
    private final BillService billService;

    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        if (prescriptionRepository.existsByPrescriptionNumber(request.getPrescriptionNumber())) {
            throw new DuplicateResourceException("Prescription", "prescriptionNumber", request.getPrescriptionNumber());
        }

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));

        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getDoctorId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new InvalidPrescriptionException("A prescription must contain at least one item");
        }

        Prescription prescription = Prescription.builder()
                .prescriptionNumber(request.getPrescriptionNumber())
                .patient(patient)
                .doctor(doctor)
                .prescriptionDate(request.getPrescriptionDate())
                .diagnosis(request.getDiagnosis())
                .status(PrescriptionStatus.PENDING)
                .notes(request.getNotes())
                .items(new ArrayList<>())
                .build();

        for (PrescriptionItemRequest itemReq : request.getItems()) {
            Drug drug = drugRepository.findById(itemReq.getDrugId())
                    .orElseThrow(() -> new ResourceNotFoundException("Drug", "id", itemReq.getDrugId()));

            if (!Boolean.TRUE.equals(drug.getActive())) {
                throw new InvalidPrescriptionException("Drug '" + drug.getBrandName() + "' is inactive and cannot be prescribed");
            }

            PrescriptionItem item = PrescriptionItem.builder()
                    .prescription(prescription)
                    .drug(drug)
                    .dosage(itemReq.getDosage())
                    .frequency(itemReq.getFrequency())
                    .duration(itemReq.getDuration())
                    .quantity(itemReq.getQuantity())
                    .dispensedQuantity(0)
                    .instructions(itemReq.getInstructions())
                    .build();

            prescription.getItems().add(item);
        }

        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));
        return mapToResponse(prescription);
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPatientPrescriptions(Long patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getDoctorPrescriptions(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescriptionResponse updatePrescription(Long id, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));

        if (!PrescriptionStatus.PENDING.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Only PENDING prescriptions can be edited. Current status: " + prescription.getStatus());
        }

        if (!prescription.getPrescriptionNumber().equals(request.getPrescriptionNumber())
                && prescriptionRepository.existsByPrescriptionNumber(request.getPrescriptionNumber())) {
            throw new DuplicateResourceException("Prescription", "prescriptionNumber", request.getPrescriptionNumber());
        }

        if (request.getPatientId() != null && !request.getPatientId().equals(prescription.getPatient().getId())) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));
            prescription.setPatient(patient);
        }

        if (request.getDoctorId() != null && !request.getDoctorId().equals(prescription.getDoctor().getId())) {
            User doctor = userRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getDoctorId()));
            prescription.setDoctor(doctor);
        }

        prescription.setPrescriptionNumber(request.getPrescriptionNumber());
        prescription.setPrescriptionDate(request.getPrescriptionDate());
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());

        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Transactional
    public PrescriptionResponse verifyPrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));

        if (PrescriptionStatus.CANCELLED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Cannot verify a CANCELLED prescription");
        }
        if (PrescriptionStatus.DISPENSED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Cannot verify an already DISPENSED prescription");
        }
        if (PrescriptionStatus.VERIFIED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Prescription is already VERIFIED");
        }
        if (!PrescriptionStatus.PENDING.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Only PENDING prescriptions can be verified. Current status: " + prescription.getStatus());
        }

        prescription.setStatus(PrescriptionStatus.VERIFIED);
        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Transactional(rollbackFor = Exception.class)
    public PrescriptionResponse dispensePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));

        if (PrescriptionStatus.CANCELLED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Cannot dispense a CANCELLED prescription");
        }
        if (PrescriptionStatus.DISPENSED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Prescription has already been DISPENSED");
        }
        if (!PrescriptionStatus.VERIFIED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Only VERIFIED prescriptions can be dispensed. Current status: " + prescription.getStatus());
        }

        if (prescription.getItems() == null || prescription.getItems().isEmpty()) {
            throw new InvalidPrescriptionException("Prescription has no items to dispense");
        }

        for (PrescriptionItem item : prescription.getItems()) {
            if (item.getDrug() == null) {
                throw new InvalidPrescriptionException("A prescription item has no associated drug");
            }
            int required = item.getQuantity() != null ? item.getQuantity() : 0;
            if (required <= 0) {
                throw new InvalidPrescriptionException("Invalid quantity for drug: " + item.getDrug().getBrandName());
            }
            inventoryService.deductStockFEFO(item.getDrug().getId(), required);
            item.setDispensedQuantity(required);
        }

        prescription.setStatus(PrescriptionStatus.DISPENSED);
        Prescription saved = prescriptionRepository.save(prescription);

        billService.generateBillForPrescription(saved);

        return mapToResponse(saved);
    }

    @Transactional
    public PrescriptionResponse cancelPrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));

        if (PrescriptionStatus.DISPENSED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Cannot cancel an already DISPENSED prescription");
        }
        if (PrescriptionStatus.CANCELLED.equals(prescription.getStatus())) {
            throw new InvalidPrescriptionException("Prescription is already CANCELLED");
        }

        prescription.setStatus(PrescriptionStatus.CANCELLED);
        return mapToResponse(prescriptionRepository.save(prescription));
    }

    public PrescriptionResponse mapToResponse(Prescription prescription) {
        List<PrescriptionItemResponse> itemResponses = null;
        if (prescription.getItems() != null) {
            itemResponses = prescription.getItems().stream()
                    .map(item -> PrescriptionItemResponse.builder()
                            .id(item.getId())
                            .drugId(item.getDrug() != null ? item.getDrug().getId() : null)
                            .drugBrandName(item.getDrug() != null ? item.getDrug().getBrandName() : null)
                            .dosage(item.getDosage())
                            .frequency(item.getFrequency())
                            .duration(item.getDuration())
                            .quantity(item.getQuantity())
                            .dispensedQuantity(item.getDispensedQuantity())
                            .instructions(item.getInstructions())
                            .build())
                    .collect(Collectors.toList());
        }

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .prescriptionNumber(prescription.getPrescriptionNumber())
                .patientId(prescription.getPatient() != null ? prescription.getPatient().getId() : null)
                .patientName(prescription.getPatient() != null ? prescription.getPatient().getName() : null)
                .doctorId(prescription.getDoctor() != null ? prescription.getDoctor().getId() : null)
                .doctorName(prescription.getDoctor() != null ? prescription.getDoctor().getName() : null)
                .prescriptionDate(prescription.getPrescriptionDate())
                .diagnosis(prescription.getDiagnosis())
                .status(prescription.getStatus())
                .notes(prescription.getNotes())
                .createdAt(prescription.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}
