package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.entity.Drug;
import com.hospital.pharmacy.entity.InventoryBatch;
import com.hospital.pharmacy.enums.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Long> {
    List<InventoryBatch> findByDrug(Drug drug);
    List<InventoryBatch> findByDrugId(Long drugId);
    List<InventoryBatch> findByStatus(BatchStatus status);

    // FEFO: Usable, available, non-expired batches ordered by expiry date ASC
    List<InventoryBatch> findByDrugIdAndStatusAndExpiryDateAfterAndQuantityGreaterThanOrderByExpiryDateAsc(
            Long drugId, BatchStatus status, LocalDate now, Integer minQuantity
    );

    // Expiring batches in window
    List<InventoryBatch> findByStatusAndExpiryDateBetweenOrderByExpiryDateAsc(
            BatchStatus status, LocalDate startDate, LocalDate endDate
    );
}
