package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.dto.PrescriptionRequest;
import com.hospital.pharmacy.dto.PrescriptionResponse;
import com.hospital.pharmacy.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @GetMapping
    public ResponseEntity<List<PrescriptionResponse>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getPrescriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionById(id));
    }

    @PostMapping
    public ResponseEntity<PrescriptionResponse> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        PrescriptionResponse response = prescriptionService.createPrescription(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> updatePrescription(@PathVariable Long id, @Valid @RequestBody PrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.updatePrescription(id, request));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getPatientPrescriptions(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> getDoctorPrescriptions(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getDoctorPrescriptions(doctorId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<PrescriptionResponse> cancelPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.cancelPrescription(id));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<PrescriptionResponse> verifyPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.verifyPrescription(id));
    }

    @PutMapping("/{id}/dispense")
    public ResponseEntity<PrescriptionResponse> dispensePrescription(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.dispensePrescription(id));
    }
}
