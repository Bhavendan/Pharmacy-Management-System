package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.entity.Bill;
import com.hospital.pharmacy.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByPatientId(Long patientId);
    Optional<Bill> findByInvoiceNumber(String invoiceNumber);
    boolean existsByInvoiceNumber(String invoiceNumber);
    List<Bill> findByBillDateBetween(LocalDateTime start, LocalDateTime end);
    List<Bill> findByPaymentStatus(PaymentStatus paymentStatus);
}
