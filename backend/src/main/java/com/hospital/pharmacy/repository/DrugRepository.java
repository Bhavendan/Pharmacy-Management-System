package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.entity.Drug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrugRepository extends JpaRepository<Drug, Long> {
    List<Drug> findByBrandNameContainingIgnoreCaseOrInnNameContainingIgnoreCase(String brandName, String innName);
    List<Drug> findByActiveTrue();
}
