package com.hospital.pharmacy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierRequest {

    @NotBlank(message = "Supplier name is required")
    @Size(min = 2, max = 100, message = "Supplier name must be between 2 and 100 characters")
    private String name;

    private String contactPerson;

    @Pattern(regexp = "^[+]?[0-9]{7,15}$", message = "Phone number must be valid (7-15 digits)")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String address;

    private String licenseNumber;

    private Boolean active;
}
