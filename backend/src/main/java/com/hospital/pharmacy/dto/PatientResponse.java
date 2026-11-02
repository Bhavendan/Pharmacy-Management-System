package com.hospital.pharmacy.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponse {

    private Long id;
    private String patientCode;
    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String phone;
    private String address;
    private String bloodGroup;
    private String allergies;
    private LocalDateTime createdAt;
}
