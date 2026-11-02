package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.DashboardSummaryResponse;
import com.hospital.pharmacy.entity.Bill;
import com.hospital.pharmacy.enums.PrescriptionStatus;
import com.hospital.pharmacy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DrugRepository drugRepository;
    private final InventoryBatchRepository inventoryBatchRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final BillRepository billRepository;
    private final InventoryService inventoryService;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        long totalUsers = userRepository.count();
        long totalPatients = patientRepository.count();
        long totalDrugs = drugRepository.count();
        long totalInventory = inventoryBatchRepository.count();
        long lowStockCount = inventoryService.getLowStockInventory().size();
        long expiringDrugCount = inventoryService.getExpiringInventory().size();
        long pendingPrescriptionCount = prescriptionRepository.countByStatus(PrescriptionStatus.PENDING);

        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        List<Bill> todayBills = billRepository.findByBillDateBetween(startOfToday, endOfToday);

        BigDecimal todaySales = todayBills.stream()
                .map(Bill::getTotalAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardSummaryResponse.builder()
                .totalUsers(totalUsers)
                .totalPatients(totalPatients)
                .totalDrugs(totalDrugs)
                .totalInventory(totalInventory)
                .lowStockCount(lowStockCount)
                .expiringDrugCount(expiringDrugCount)
                .pendingPrescriptionCount(pendingPrescriptionCount)
                .todaySales(todaySales)
                .build();
    }
}
