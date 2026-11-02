package com.hospital.pharmacy.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrugRequest {

    private String innName;

    @NotBlank(message = "Brand name is required")
    @Size(min = 2, max = 100, message = "Brand name must be between 2 and 100 characters")
    private String brandName;

    private String category;

    private String dosageForm;

    private String unit;

    @PositiveOrZero(message = "Selling price must be zero or positive")
    private BigDecimal sellingPrice;

    @PositiveOrZero(message = "Reorder level must be zero or positive")
    private Integer reorderLevel;

    @DecimalMin(value = "0.0", inclusive = true, message = "GST percentage must be 0 or greater")
    @DecimalMax(value = "100.0", inclusive = true, message = "GST percentage must be 100 or less")
    private BigDecimal gstPercentage;

    private Boolean active;
}
