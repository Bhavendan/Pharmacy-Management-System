package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.PaymentMethod;
import com.hospital.pharmacy.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentUpdateRequest {

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
