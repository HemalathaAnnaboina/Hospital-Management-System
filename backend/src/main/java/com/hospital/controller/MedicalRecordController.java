package com.hospital.controller;

import com.hospital.dto.request.MedicalRecordRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.MedicalRecordResponse;
import com.hospital.entity.User;
import com.hospital.service.AuthService;
import com.hospital.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> createMedicalRecord(
            @Valid @RequestBody MedicalRecordRequest request) {
        User currentUser = authService.getCurrentUser();
        MedicalRecordResponse res = medicalRecordService.createMedicalRecord(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Medical record created successfully", res));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<MedicalRecordResponse>> getRecordByAppointment(
            @PathVariable Long appointmentId) {
        MedicalRecordResponse res = medicalRecordService.getRecordByAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.ok("Medical record retrieved", res));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getRecordsByPatient(
            @PathVariable Long patientId) {
        List<MedicalRecordResponse> records = medicalRecordService.getRecordsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.ok("Patient medical records retrieved", records));
    }
}
