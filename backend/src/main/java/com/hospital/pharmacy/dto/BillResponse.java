package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.PaymentMethod;
import com.hospital.pharmacy.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillResponse {

    private Long id;
    private String invoiceNumber;
    private Long prescriptionId;
    private Long patientId;
    private String patientName;
    private LocalDateTime billDate;
    private BigDecimal subtotal;
    private BigDecimal gstAmount;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private PaymentMethod paymentMethod;
}
