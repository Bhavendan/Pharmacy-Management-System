package com.hospital.pharmacy.dto;

import com.hospital.pharmacy.enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private Boolean enabled;
    private LocalDateTime createdAt;
}
