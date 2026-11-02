package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.InventoryRequest;
import com.hospital.pharmacy.dto.InventoryResponse;
import com.hospital.pharmacy.entity.Drug;
import com.hospital.pharmacy.entity.InventoryBatch;
import com.hospital.pharmacy.enums.BatchStatus;
import com.hospital.pharmacy.exception.ResourceNotFoundException;
import com.hospital.pharmacy.exception.StockInsufficientException;
import com.hospital.pharmacy.repository.DrugRepository;
import com.hospital.pharmacy.repository.InventoryBatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryBatchRepository inventoryBatchRepository;
    private final DrugRepository drugRepository;

    @Value("${pharmacy.expiry.warning.days:30}")
    private int expiryWarningDays;

    @Transactional
    public InventoryResponse addStock(InventoryRequest request) {
        Drug drug = drugRepository.findById(request.getDrugId())
                .orElseThrow(() -> new ResourceNotFoundException("Drug", "id", request.getDrugId()));

        BatchStatus status = request.getStatus() != null ? request.getStatus() : BatchStatus.AVAILABLE;

        InventoryBatch batch = InventoryBatch.builder()
                .drug(drug)
                .batchNumber(request.getBatchNumber())
                .manufactureDate(request.getManufactureDate())
                .expiryDate(request.getExpiryDate())
                .quantity(request.getQuantity())
                .unitCost(request.getUnitCost())
                .binLocation(request.getBinLocation())
                .status(status)
                .receivedDate(request.getReceivedDate())
                .build();

        return mapToResponse(inventoryBatchRepository.save(batch));
    }

    @Transactional(readOnly = true)
    public InventoryResponse getInventoryById(Long id) {
        InventoryBatch batch = inventoryBatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryBatch", "id", id));
        return mapToResponse(batch);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return inventoryBatchRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventoryByDrug(Long drugId) {
        return inventoryBatchRepository.findByDrugId(drugId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InventoryResponse updateStock(Long id, InventoryRequest request) {
        InventoryBatch batch = inventoryBatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryBatch", "id", id));

        if (request.getDrugId() != null && !request.getDrugId().equals(batch.getDrug().getId())) {
            Drug drug = drugRepository.findById(request.getDrugId())
                    .orElseThrow(() -> new ResourceNotFoundException("Drug", "id", request.getDrugId()));
            batch.setDrug(drug);
        }

        batch.setBatchNumber(request.getBatchNumber());
        batch.setManufactureDate(request.getManufactureDate());
        batch.setExpiryDate(request.getExpiryDate());
        batch.setQuantity(request.getQuantity());
        batch.setUnitCost(request.getUnitCost());
        batch.setBinLocation(request.getBinLocation());
        if (request.getStatus() != null) {
            batch.setStatus(request.getStatus());
        }
        batch.setReceivedDate(request.getReceivedDate());

        return mapToResponse(inventoryBatchRepository.save(batch));
    }

    /**
     * FEFO: First-Expiry-First-Out stock deduction.
     * Sorts available, non-expired batches by expiryDate ASC and deducts from earliest first.
     * Throws StockInsufficientException if total available stock < requiredQuantity.
     * All batch saves happen within the caller's transaction.
     */
    @Transactional
    public void deductStockFEFO(Long drugId, Integer requiredQuantity) {
        LocalDate today = LocalDate.now();

        // Get usable batches: AVAILABLE status, not expired, quantity > 0, sorted by expiry ASC (FEFO order)
        List<InventoryBatch> usableBatches = inventoryBatchRepository
                .findByDrugIdAndStatusAndExpiryDateAfterAndQuantityGreaterThanOrderByExpiryDateAsc(
                        drugId, BatchStatus.AVAILABLE, today, 0
                );

        // Validate total available stock
        int totalAvailable = usableBatches.stream()
                .mapToInt(InventoryBatch::getQuantity)
                .sum();

        if (totalAvailable < requiredQuantity) {
            Drug drug = drugRepository.findById(drugId)
                    .orElse(null);
            String drugName = drug != null ? drug.getBrandName() : "Drug ID " + drugId;
            throw new StockInsufficientException(
                    "Insufficient stock for drug '" + drugName + "'. Required: " + requiredQuantity
                            + ", Available: " + totalAvailable
            );
        }

        // Deduct stock using FEFO
        int remaining = requiredQuantity;
        for (InventoryBatch batch : usableBatches) {
            if (remaining <= 0) break;

            int deduct = Math.min(batch.getQuantity(), remaining);
            batch.setQuantity(batch.getQuantity() - deduct);
            remaining -= deduct;

            // If batch is fully consumed, mark as OUT_OF_STOCK
            if (batch.getQuantity() == 0) {
                batch.setStatus(BatchStatus.OUT_OF_STOCK);
            }

            inventoryBatchRepository.save(batch);
        }
    }

    /**
     * Returns inventory batches for drugs that are below their reorder level.
     */
    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockInventory() {
        return inventoryBatchRepository.findByStatus(BatchStatus.AVAILABLE).stream()
                .filter(batch -> {
                    Drug drug = batch.getDrug();
                    if (drug == null || !Boolean.TRUE.equals(drug.getActive())) return false;
                    if (drug.getReorderLevel() == null) return false;
                    return batch.getQuantity() <= drug.getReorderLevel();
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns inventory batches expiring within the configured warning window (default 30 days).
     */
    @Transactional(readOnly = true)
    public List<InventoryResponse> getExpiringInventory() {
        LocalDate today = LocalDate.now();
        LocalDate warningDate = today.plusDays(expiryWarningDays);

        return inventoryBatchRepository
                .findByStatusAndExpiryDateBetweenOrderByExpiryDateAsc(BatchStatus.AVAILABLE, today, warningDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public InventoryResponse mapToResponse(InventoryBatch batch) {
        return InventoryResponse.builder()
                .id(batch.getId())
                .drugId(batch.getDrug() != null ? batch.getDrug().getId() : null)
                .drugBrandName(batch.getDrug() != null ? batch.getDrug().getBrandName() : null)
                .batchNumber(batch.getBatchNumber())
                .manufactureDate(batch.getManufactureDate())
                .expiryDate(batch.getExpiryDate())
                .quantity(batch.getQuantity())
                .unitCost(batch.getUnitCost())
                .binLocation(batch.getBinLocation())
                .status(batch.getStatus())
                .receivedDate(batch.getReceivedDate())
                .build();
    }
}
