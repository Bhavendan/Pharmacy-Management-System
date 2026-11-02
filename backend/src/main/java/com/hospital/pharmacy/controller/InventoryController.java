package com.hospital.pharmacy.controller;

import com.hospital.pharmacy.dto.InventoryRequest;
import com.hospital.pharmacy.dto.InventoryResponse;
import com.hospital.pharmacy.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    @GetMapping("/drug/{drugId}")
    public ResponseEntity<List<InventoryResponse>> getInventoryByDrug(@PathVariable Long drugId) {
        return ResponseEntity.ok(inventoryService.getInventoryByDrug(drugId));
    }

    @PostMapping
    public ResponseEntity<InventoryResponse> addStock(@Valid @RequestBody InventoryRequest request) {
        InventoryResponse response = inventoryService.addStock(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> updateStock(@PathVariable Long id, @Valid @RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.updateStock(id, request));
    }

    /**
     * Returns batches for drugs whose total available stock is at or below the drug's reorderLevel.
     */
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockInventory() {
        return ResponseEntity.ok(inventoryService.getLowStockInventory());
    }

    /**
     * Returns AVAILABLE batches expiring within the configured warning window (default 30 days).
     * Configurable via application.properties: pharmacy.expiry.warning.days=30
     */
    @GetMapping("/expiring")
    public ResponseEntity<List<InventoryResponse>> getExpiringInventory() {
        return ResponseEntity.ok(inventoryService.getExpiringInventory());
    }
}
