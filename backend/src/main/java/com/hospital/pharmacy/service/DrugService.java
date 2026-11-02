package com.hospital.pharmacy.service;

import com.hospital.pharmacy.dto.DrugRequest;
import com.hospital.pharmacy.dto.DrugResponse;
import com.hospital.pharmacy.entity.Drug;
import com.hospital.pharmacy.exception.ResourceNotFoundException;
import com.hospital.pharmacy.repository.DrugRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DrugService {

    private final DrugRepository drugRepository;

    @Transactional
    public DrugResponse createDrug(DrugRequest request) {
        Drug drug = Drug.builder()
                .innName(request.getInnName())
                .brandName(request.getBrandName())
                .category(request.getCategory())
                .dosageForm(request.getDosageForm())
                .unit(request.getUnit())
                .sellingPrice(request.getSellingPrice())
                .reorderLevel(request.getReorderLevel())
                .gstPercentage(request.getGstPercentage())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return mapToResponse(drugRepository.save(drug));
    }

    @Transactional(readOnly = true)
    public DrugResponse getDrugById(Long id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug", "id", id));
        return mapToResponse(drug);
    }

    @Transactional(readOnly = true)
    public List<DrugResponse> getAllDrugs() {
        return drugRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DrugResponse updateDrug(Long id, DrugRequest request) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug", "id", id));

        drug.setInnName(request.getInnName());
        drug.setBrandName(request.getBrandName());
        drug.setCategory(request.getCategory());
        drug.setDosageForm(request.getDosageForm());
        drug.setUnit(request.getUnit());
        drug.setSellingPrice(request.getSellingPrice());
        drug.setReorderLevel(request.getReorderLevel());
        drug.setGstPercentage(request.getGstPercentage());
        if (request.getActive() != null) {
            drug.setActive(request.getActive());
        }

        return mapToResponse(drugRepository.save(drug));
    }

    @Transactional
    public void deleteDrug(Long id) {
        if (!drugRepository.existsById(id)) {
            throw new ResourceNotFoundException("Drug", "id", id);
        }
        drugRepository.deleteById(id);
    }

    @Transactional
    public DrugResponse deactivateDrug(Long id) {
        Drug drug = drugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drug", "id", id));
        drug.setActive(false);
        return mapToResponse(drugRepository.save(drug));
    }

    @Transactional(readOnly = true)
    public List<DrugResponse> searchDrugs(String query) {
        if (query == null || query.isBlank()) {
            return getAllDrugs();
        }
        return drugRepository.findByBrandNameContainingIgnoreCaseOrInnNameContainingIgnoreCase(query, query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DrugResponse mapToResponse(Drug drug) {
        return DrugResponse.builder()
                .id(drug.getId())
                .innName(drug.getInnName())
                .brandName(drug.getBrandName())
                .category(drug.getCategory())
                .dosageForm(drug.getDosageForm())
                .unit(drug.getUnit())
                .sellingPrice(drug.getSellingPrice())
                .reorderLevel(drug.getReorderLevel())
                .gstPercentage(drug.getGstPercentage())
                .active(drug.getActive())
                .createdAt(drug.getCreatedAt())
                .build();
    }
}
