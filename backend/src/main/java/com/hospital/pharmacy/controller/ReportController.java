package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.dto.BillResponse;
import com.hospital.pharmacy.dto.InventoryResponse;
import com.hospital.pharmacy.dto.PrescriptionResponse;
import com.hospital.pharmacy.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockReport() {
        return ResponseEntity.ok(reportService.getLowStockReport());
    }

    @GetMapping("/expiry")
    public ResponseEntity<List<InventoryResponse>> getExpiryReport() {
        return ResponseEntity.ok(reportService.getExpiryReport());
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<List<PrescriptionResponse>> getPrescriptionReport() {
        return ResponseEntity.ok(reportService.getPrescriptionReport());
    }

    @GetMapping("/sales")
    public ResponseEntity<List<BillResponse>> getSalesReport() {
        return ResponseEntity.ok(reportService.getSalesReport());
    }
}
