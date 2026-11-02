package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.dto.DrugRequest;
import com.hospital.pharmacy.dto.DrugResponse;
import com.hospital.pharmacy.service.DrugService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drugs")
@RequiredArgsConstructor
public class DrugController {

    private final DrugService drugService;

    @GetMapping
    public ResponseEntity<List<DrugResponse>> getAllDrugs() {
        return ResponseEntity.ok(drugService.getAllDrugs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DrugResponse> getDrugById(@PathVariable Long id) {
        return ResponseEntity.ok(drugService.getDrugById(id));
    }

    @PostMapping
    public ResponseEntity<DrugResponse> createDrug(@Valid @RequestBody DrugRequest request) {
        DrugResponse response = drugService.createDrug(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DrugResponse> updateDrug(@PathVariable Long id, @Valid @RequestBody DrugRequest request) {
        return ResponseEntity.ok(drugService.updateDrug(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDrug(@PathVariable Long id) {
        drugService.deleteDrug(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<DrugResponse>> searchDrugs(@RequestParam(required = false, defaultValue = "") String keyword) {
        return ResponseEntity.ok(drugService.searchDrugs(keyword));
    }
}
