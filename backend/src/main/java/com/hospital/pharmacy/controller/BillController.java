package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.dto.BillRequest;
import com.hospital.pharmacy.dto.BillResponse;
import com.hospital.pharmacy.dto.PaymentUpdateRequest;
import com.hospital.pharmacy.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping
    public ResponseEntity<List<BillResponse>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillResponse> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<BillResponse>> getPatientBills(@PathVariable Long patientId) {
        return ResponseEntity.ok(billService.getPatientBills(patientId));
    }

    @PostMapping
    public ResponseEntity<BillResponse> createBill(@Valid @RequestBody BillRequest request) {
        BillResponse response = billService.createBill(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<BillResponse> updatePayment(@PathVariable Long id, @Valid @RequestBody PaymentUpdateRequest request) {
        return ResponseEntity.ok(billService.updatePayment(id, request));
    }
}
