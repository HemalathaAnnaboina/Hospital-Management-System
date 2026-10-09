package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.MedicineResponse;
import com.hospital.entity.Medicine;
import com.hospital.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getMedicines(
            @RequestParam(required = false) String search) {
        List<Medicine> list;
        if (search != null && !search.trim().isEmpty()) {
            list = medicineRepository.findByNameContainingIgnoreCaseAndActiveTrue(search.trim());
        } else {
            list = medicineRepository.findByActiveTrueOrderByNameAsc();
        }
        List<MedicineResponse> res = list.stream().map(MedicineResponse::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Medicines retrieved", res));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MedicineResponse>> addMedicine(@RequestBody Medicine medicine) {
        medicine.setActive(true);
        Medicine saved = medicineRepository.save(medicine);
        return ResponseEntity.ok(ApiResponse.ok("Medicine added to inventory", MedicineResponse.fromEntity(saved)));
    }
}
