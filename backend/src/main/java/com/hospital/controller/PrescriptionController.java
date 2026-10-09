package com.hospital.controller;

import com.hospital.dto.request.PrescriptionRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.PrescriptionResponse;
import com.hospital.entity.User;
import com.hospital.service.AuthService;
import com.hospital.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> createPrescription(
            @Valid @RequestBody PrescriptionRequest request) {
        User currentUser = authService.getCurrentUser();
        PrescriptionResponse res = prescriptionService.createPrescription(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Prescription created successfully", res));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<PrescriptionResponse>> getPrescriptionByAppointment(
            @PathVariable Long appointmentId) {
        PrescriptionResponse res = prescriptionService.getPrescriptionByAppointment(appointmentId);
        return ResponseEntity.ok(ApiResponse.ok("Prescription retrieved", res));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<PrescriptionResponse>>> getPrescriptionsByPatient(
            @PathVariable Long patientId) {
        List<PrescriptionResponse> list = prescriptionService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(ApiResponse.ok("Patient prescriptions retrieved", list));
    }
}
