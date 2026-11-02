package com.hospital.pharmacy.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemResponse {

    private Long id;
    private Long drugId;
    private String drugBrandName;
    private String dosage;
    private String frequency;
    private String duration;
    private Integer quantity;
    private Integer dispensedQuantity;
    private String instructions;
}
