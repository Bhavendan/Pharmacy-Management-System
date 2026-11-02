package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.BatchStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryResponse {

    private Long id;
    private Long drugId;
    private String drugBrandName;
    private String batchNumber;
    private LocalDate manufactureDate;
    private LocalDate expiryDate;
    private Integer quantity;
    private BigDecimal unitCost;
    private String binLocation;
    private BatchStatus status;
    private LocalDate receivedDate;
}
