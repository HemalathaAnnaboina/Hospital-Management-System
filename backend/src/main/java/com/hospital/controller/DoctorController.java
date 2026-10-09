package com.hospital.controller;

import com.hospital.dto.response.*;
import com.hospital.entity.AppointmentStatus;
import com.hospital.entity.User;
import com.hospital.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AuthService authService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDoctorDashboard() {
        User user = authService.getCurrentUser();
        DoctorResponse doc = doctorService.getDoctorByUserId(user.getId());

        List<AppointmentResponse> today = appointmentService.getTodayAppointmentsByDoctor(doc.getId());
        List<AppointmentResponse> all = appointmentService.getAppointmentsByDoctor(doc.getId());

        long completed = all.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
        long pending = all.stream().filter(a -> a.getStatus() == AppointmentStatus.BOOKED || a.getStatus() == AppointmentStatus.CONFIRMED).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("doctorInfo", doc);
        stats.put("todayAppointmentsCount", today.size());
        stats.put("completedCount", completed);
        stats.put("pendingCount", pending);
        stats.put("totalAppointmentsCount", all.size());

        return ResponseEntity.ok(ApiResponse.ok("Doctor dashboard statistics retrieved", stats));
    }

    @GetMapping("/appointments/today")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getTodayAppointments() {
        User user = authService.getCurrentUser();
        DoctorResponse doc = doctorService.getDoctorByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Today's appointments retrieved", appointmentService.getTodayAppointmentsByDoctor(doc.getId())));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllDoctorAppointments() {
        User user = authService.getCurrentUser();
        DoctorResponse doc = doctorService.getDoctorByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Doctor's appointments retrieved", appointmentService.getAppointmentsByDoctor(doc.getId())));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            @RequestParam(required = false) String cancellationReason) {
        AppointmentResponse res = appointmentService.updateAppointmentStatus(id, status, cancellationReason);
        return ResponseEntity.ok(ApiResponse.ok("Appointment status updated to " + status, res));
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<ApiResponse<PatientResponse>> getPatientDetails(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok("Patient details retrieved", patientService.getPatientById(patientId)));
    }

    @GetMapping("/patients/{patientId}/records")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getPatientMedicalHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok("Patient medical records retrieved", medicalRecordService.getRecordsByPatient(patientId)));
    }

    @GetMapping("/patients/{patientId}/prescriptions")
    public ResponseEntity<ApiResponse<List<PrescriptionResponse>>> getPatientPrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok("Patient prescriptions retrieved", prescriptionService.getPrescriptionsByPatient(patientId)));
    }
}
