package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.BillResponse;
import com.hospital.pharmacy.dto.InventoryResponse;
import com.hospital.pharmacy.dto.PrescriptionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final InventoryService inventoryService;
    private final PrescriptionService prescriptionService;
    private final BillService billService;

    @Transactional(readOnly = true)
    public List<InventoryResponse> getLowStockReport() {
        return inventoryService.getLowStockInventory();
    }

    @Transactional(readOnly = true)
    public List<InventoryResponse> getExpiryReport() {
        return inventoryService.getExpiringInventory();
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionReport() {
        return prescriptionService.getAllPrescriptions();
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getSalesReport() {
        return billService.getAllBills();
    }
}
