package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.PaymentMethod;
import com.hospital.pharmacy.enums.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillRequest {

    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    private Long prescriptionId;

    @NotNull(message = "Patient ID is required")
    @Positive(message = "Patient ID must be positive")
    private Long patientId;

    private LocalDateTime billDate;

    @PositiveOrZero(message = "Subtotal must be zero or positive")
    private BigDecimal subtotal;

    @PositiveOrZero(message = "GST amount must be zero or positive")
    private BigDecimal gstAmount;

    @PositiveOrZero(message = "Discount must be zero or positive")
    private BigDecimal discount;

    @PositiveOrZero(message = "Total amount must be zero or positive")
    private BigDecimal totalAmount;

    private PaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;
}
