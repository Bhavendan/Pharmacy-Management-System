package com.hospital.pharmacy.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hospital.pharmacy.enums.PrescriptionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String prescriptionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    private LocalDate prescriptionDate;

    private String diagnosis;

    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status;

    private String notes;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PrescriptionItem> items = new ArrayList<>();

    @OneToOne(mappedBy = "prescription", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Bill bill;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (prescriptionDate == null) {
            prescriptionDate = LocalDate.now();
        }
    }
}
