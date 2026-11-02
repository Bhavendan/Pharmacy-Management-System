package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.PrescriptionStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponse {

    private Long id;
    private String prescriptionNumber;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDate prescriptionDate;
    private String diagnosis;
    private PrescriptionStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private List<PrescriptionItemResponse> items;
}
