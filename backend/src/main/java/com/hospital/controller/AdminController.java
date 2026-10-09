package com.hospital.controller;

import com.hospital.dto.request.DoctorCreateRequest;
import com.hospital.dto.request.DoctorUpdateRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.dto.response.DashboardStatsResponse;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.dto.response.PatientResponse;
import com.hospital.service.AdminService;
import com.hospital.service.AppointmentService;
import com.hospital.service.DoctorService;
import com.hospital.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", adminService.getDashboardStats()));
    }

    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<DoctorResponse>> addDoctor(@Valid @RequestBody DoctorCreateRequest request) {
        DoctorResponse res = doctorService.createDoctor(request);
        return ResponseEntity.ok(ApiResponse.ok("Doctor registered successfully", res));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(
            @PathVariable Long id, @Valid @RequestBody DoctorUpdateRequest request) {
        DoctorResponse res = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Doctor updated successfully", res));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<Void>> deactivateDoctor(@PathVariable Long id) {
        doctorService.toggleDoctorStatus(id, false);
        return ResponseEntity.ok(ApiResponse.ok("Doctor deactivated successfully"));
    }

    @PutMapping("/doctors/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateDoctor(@PathVariable Long id) {
        doctorService.toggleDoctorStatus(id, true);
        return ResponseEntity.ok(ApiResponse.ok("Doctor activated successfully"));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.ok("All doctors retrieved", doctorService.getAllDoctors()));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<PatientResponse>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.ok("Patients retrieved", patientService.getAllPatients()));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.ok("Appointments retrieved", appointmentService.getAllAppointments()));
    }
}
