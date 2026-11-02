package com.hospital.pharmacy.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private long totalUsers;
    private long totalPatients;
    private long totalDrugs;
    private long totalInventory;
    private long lowStockCount;
    private long expiringDrugCount;
    private long pendingPrescriptionCount;
    private BigDecimal todaySales;
}
