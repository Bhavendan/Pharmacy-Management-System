package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.BatchStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRequest {

    @NotNull(message = "Drug ID is required")
    @Positive(message = "Drug ID must be a positive number")
    private Long drugId;

    @NotBlank(message = "Batch number is required")
    @Size(max = 50, message = "Batch number must not exceed 50 characters")
    private String batchNumber;

    private LocalDate manufactureDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity must be zero or positive")
    private Integer quantity;

    @PositiveOrZero(message = "Unit cost must be zero or positive")
    private BigDecimal unitCost;

    private String binLocation;

    private BatchStatus status;

    private LocalDate receivedDate;
}
