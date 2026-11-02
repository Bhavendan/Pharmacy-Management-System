package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.PrescriptionStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionRequest {

    @NotBlank(message = "Prescription number is required")
    @Size(max = 30, message = "Prescription number must not exceed 30 characters")
    private String prescriptionNumber;

    @NotNull(message = "Patient ID is required")
    @Positive(message = "Patient ID must be positive")
    private Long patientId;

    @NotNull(message = "Doctor ID is required")
    @Positive(message = "Doctor ID must be positive")
    private Long doctorId;

    private LocalDate prescriptionDate;

    @Size(max = 500, message = "Diagnosis must not exceed 500 characters")
    private String diagnosis;

    private PrescriptionStatus status;

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;

    @NotNull(message = "Prescription must contain at least one item")
    @Size(min = 1, message = "Prescription must contain at least one item")
    @Valid
    private List<PrescriptionItemRequest> items;
}
