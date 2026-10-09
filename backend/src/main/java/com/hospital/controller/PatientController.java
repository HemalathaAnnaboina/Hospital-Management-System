package com.hospital.controller;

import com.hospital.dto.request.AppointmentBookingRequest;
import com.hospital.dto.request.ProfileUpdateRequest;
import com.hospital.dto.response.*;
import com.hospital.entity.User;
import com.hospital.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private BillingService billingService;

    @Autowired
    private AuthService authService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        User user = authService.getCurrentUser();
        PatientResponse patient = patientService.getPatientByUserId(user.getId());

        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatient(patient.getId());
        List<MedicalRecordResponse> records = medicalRecordService.getRecordsByPatient(patient.getId());
        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsByPatient(patient.getId());
        List<BillResponse> bills = billingService.getBillsByPatient(patient.getId());

        Map<String, Object> data = new HashMap<>();
        data.put("profile", patient);
        data.put("totalAppointments", appointments.size());
        data.put("totalRecords", records.size());
        data.put("totalPrescriptions", prescriptions.size());
        data.put("totalBills", bills.size());
        data.put("recentAppointments", appointments.stream().limit(5).toList());

        return ResponseEntity.ok(ApiResponse.ok("Patient dashboard retrieved", data));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<PatientResponse>> getProfile() {
        User user = authService.getCurrentUser();
        PatientResponse patient = patientService.getPatientByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Patient profile retrieved", patient));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<PatientResponse>> updateProfile(@RequestBody ProfileUpdateRequest request) {
        User user = authService.getCurrentUser();
        PatientResponse updated = patientService.updatePatientProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/appointments")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @Valid @RequestBody AppointmentBookingRequest request) {
        User user = authService.getCurrentUser();
        AppointmentResponse res = appointmentService.bookAppointment(request, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Appointment booked successfully", res));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointments() {
        User user = authService.getCurrentUser();
        PatientResponse patient = patientService.getPatientByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Appointments retrieved", appointmentService.getAppointmentsByPatient(patient.getId())));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancelAppointment(
            @PathVariable Long id, @RequestParam(required = false) String reason) {
        User user = authService.getCurrentUser();
        AppointmentResponse res = appointmentService.cancelAppointmentByPatient(id, user.getId(), reason);
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled successfully", res));
    }

    @GetMapping("/medical-records")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getMedicalRecords() {
        User user = authService.getCurrentUser();
        PatientResponse patient = patientService.getPatientByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Medical records retrieved", medicalRecordService.getRecordsByPatient(patient.getId())));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<ApiResponse<List<PrescriptionResponse>>> getPrescriptions() {
        User user = authService.getCurrentUser();
        PatientResponse patient = patientService.getPatientByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Prescriptions retrieved", prescriptionService.getPrescriptionsByPatient(patient.getId())));
    }

    @GetMapping("/bills")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getBills() {
        User user = authService.getCurrentUser();
        PatientResponse patient = patientService.getPatientByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Bills retrieved", billingService.getBillsByPatient(patient.getId())));
    }
}
