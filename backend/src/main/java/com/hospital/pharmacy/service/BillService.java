package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.BillRequest;
import com.hospital.pharmacy.dto.BillResponse;
import com.hospital.pharmacy.dto.PaymentUpdateRequest;
import com.hospital.pharmacy.entity.Bill;
import com.hospital.pharmacy.entity.Patient;
import com.hospital.pharmacy.entity.Prescription;
import com.hospital.pharmacy.entity.PrescriptionItem;
import com.hospital.pharmacy.enums.PaymentStatus;
import com.hospital.pharmacy.exception.DuplicateResourceException;
import com.hospital.pharmacy.exception.ResourceNotFoundException;
import com.hospital.pharmacy.repository.BillRepository;
import com.hospital.pharmacy.repository.PatientRepository;
import com.hospital.pharmacy.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionRepository prescriptionRepository;

    @Transactional(readOnly = true)
    public BillResponse getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
        return mapToResponse(bill);
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getAllBills() {
        return billRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BillResponse> getPatientBills(Long patientId) {
        return billRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BillResponse createBill(BillRequest request) {
        if (billRepository.existsByInvoiceNumber(request.getInvoiceNumber())) {
            throw new DuplicateResourceException("Bill", "invoiceNumber", request.getInvoiceNumber());
        }

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));

        Prescription prescription = null;
        if (request.getPrescriptionId() != null) {
            prescription = prescriptionRepository.findById(request.getPrescriptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", request.getPrescriptionId()));
        }

        Bill bill = Bill.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .prescription(prescription)
                .patient(patient)
                .billDate(request.getBillDate() != null ? request.getBillDate() : LocalDateTime.now())
                .subtotal(request.getSubtotal())
                .gstAmount(request.getGstAmount())
                .discount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO)
                .totalAmount(request.getTotalAmount())
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .build();

        return mapToResponse(billRepository.save(bill));
    }

    @Transactional
    public BillResponse generateBillForPrescription(Prescription prescription) {
        if (prescription.getBill() != null) {
            throw new IllegalStateException("A bill already exists for prescription: " + prescription.getPrescriptionNumber());
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalGst = BigDecimal.ZERO;

        for (PrescriptionItem item : prescription.getItems()) {
            if (item.getDrug() == null) continue;

            int qty = item.getDispensedQuantity() != null ? item.getDispensedQuantity() : 0;
            BigDecimal sellingPrice = item.getDrug().getSellingPrice() != null
                    ? item.getDrug().getSellingPrice()
                    : BigDecimal.ZERO;
            BigDecimal gstPct = item.getDrug().getGstPercentage() != null
                    ? item.getDrug().getGstPercentage()
                    : BigDecimal.ZERO;

            BigDecimal lineTotal = sellingPrice.multiply(BigDecimal.valueOf(qty));
            BigDecimal lineGst = lineTotal.multiply(gstPct)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            subtotal = subtotal.add(lineTotal);
            totalGst = totalGst.add(lineGst);
        }

        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(totalGst).subtract(discount);

        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        String invoiceNumber = "INV-" + System.currentTimeMillis();

        Bill bill = Bill.builder()
                .invoiceNumber(invoiceNumber)
                .prescription(prescription)
                .patient(prescription.getPatient())
                .billDate(LocalDateTime.now())
                .subtotal(subtotal.setScale(2, RoundingMode.HALF_UP))
                .gstAmount(totalGst.setScale(2, RoundingMode.HALF_UP))
                .discount(discount)
                .totalAmount(totalAmount.setScale(2, RoundingMode.HALF_UP))
                .paymentStatus(PaymentStatus.PENDING)
                .paymentMethod(null)
                .build();

        return mapToResponse(billRepository.save(bill));
    }

    @Transactional
    public BillResponse updatePayment(Long billId, PaymentUpdateRequest request) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", billId));

        if (PaymentStatus.PAID.equals(bill.getPaymentStatus()) && PaymentStatus.PENDING.equals(request.getPaymentStatus())) {
            throw new IllegalStateException("Cannot revert a PAID bill back to PENDING status");
        }

        bill.setPaymentStatus(request.getPaymentStatus());
        bill.setPaymentMethod(request.getPaymentMethod());

        return mapToResponse(billRepository.save(bill));
    }

    public BillResponse mapToResponse(Bill bill) {
        return BillResponse.builder()
                .id(bill.getId())
                .invoiceNumber(bill.getInvoiceNumber())
                .prescriptionId(bill.getPrescription() != null ? bill.getPrescription().getId() : null)
                .patientId(bill.getPatient() != null ? bill.getPatient().getId() : null)
                .patientName(bill.getPatient() != null ? bill.getPatient().getName() : null)
                .billDate(bill.getBillDate())
                .subtotal(bill.getSubtotal())
                .gstAmount(bill.getGstAmount())
                .discount(bill.getDiscount())
                .totalAmount(bill.getTotalAmount())
                .paymentStatus(bill.getPaymentStatus())
                .paymentMethod(bill.getPaymentMethod())
                .build();
    }
}
