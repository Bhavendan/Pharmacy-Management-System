package com.hospital.pharmacy.entity;

import com.hospital.pharmacy.enums.BatchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drug_id", nullable = false)
    private Drug drug;

    private String batchNumber;

    private LocalDate manufactureDate;

    private LocalDate expiryDate;

    private Integer quantity;

    private BigDecimal unitCost;

    private String binLocation;

    @Enumerated(EnumType.STRING)
    private BatchStatus status;

    private LocalDate receivedDate;
}
