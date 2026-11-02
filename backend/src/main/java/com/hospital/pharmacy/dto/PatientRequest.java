package com.hospital.pharmacy.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRequest {

    @NotBlank(message = "Patient code is required")
    @Size(max = 20, message = "Patient code must not exceed 20 characters")
    private String patientCode;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    private String gender;

    @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid (7-15 digits)")
    private String phone;

    private String address;

    private String bloodGroup;

    private String allergies;
}
