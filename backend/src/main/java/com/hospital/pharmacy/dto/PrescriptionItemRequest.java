package com.hospital.pharmacy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemRequest {

    @NotNull(message = "Drug ID is required")
    @Positive(message = "Drug ID must be positive")
    private Long drugId;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    private String frequency;

    private String duration;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Integer quantity;

    private Integer dispensedQuantity;

    private String instructions;
}
