package com.hospital.pharmacy.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrugResponse {

    private Long id;
    private String innName;
    private String brandName;
    private String category;
    private String dosageForm;
    private String unit;
    private BigDecimal sellingPrice;
    private Integer reorderLevel;
    private BigDecimal gstPercentage;
    private Boolean active;
    private LocalDateTime createdAt;
}
