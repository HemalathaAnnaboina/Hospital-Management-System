package com.hospital.controller;

import com.hospital.dto.request.AppointmentBookingRequest;
import com.hospital.dto.request.AppointmentRescheduleRequest;
import com.hospital.dto.request.ProfileUpdateRequest;
import com.hospital.dto.request.RegisterRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.dto.response.PatientResponse;
import com.hospital.entity.AppointmentStatus;
import com.hospital.service.AppointmentService;
import com.hospital.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receptionist")
@PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
public class ReceptionistController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        List<AppointmentResponse> today = appointmentService.getTodayAppointments();
        List<PatientResponse> patients = patientService.getAllPatients();

        long completed = today.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
        long pending = today.stream().filter(a -> a.getStatus() == AppointmentStatus.BOOKED || a.getStatus() == AppointmentStatus.CONFIRMED).count();

        Map<String, Object> data = new HashMap<>();
        data.put("totalPatients", patients.size());
        data.put("todayAppointmentsCount", today.size());
        data.put("todayCompletedCount", completed);
        data.put("todayPendingCount", pending);
        data.put("todayAppointments", today);

        return ResponseEntity.ok(ApiResponse.ok("Receptionist dashboard statistics retrieved", data));
    }

    @PostMapping("/patients")
    public ResponseEntity<ApiResponse<PatientResponse>> registerPatient(@Valid @RequestBody RegisterRequest request) {
        PatientResponse patient = patientService.registerPatientByStaff(request);
        return ResponseEntity.ok(ApiResponse.ok("Patient registered successfully", patient));
    }

    @GetMapping("/patients/search")
    public ResponseEntity<ApiResponse<List<PatientResponse>>> searchPatients(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(ApiResponse.ok("Patients retrieved", patientService.searchPatients(query)));
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<ApiResponse<PatientResponse>> updatePatient(
            @PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        PatientResponse existing = patientService.getPatientById(id);
        PatientResponse updated = patientService.updatePatientProfile(existing.getUserId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Patient information updated successfully", updated));
    }

    @PostMapping("/appointments")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @Valid @RequestBody AppointmentBookingRequest request) {
        AppointmentResponse res = appointmentService.bookAppointment(request, null);
        return ResponseEntity.ok(ApiResponse.ok("Appointment booked successfully", res));
    }

    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<ApiResponse<AppointmentResponse>> rescheduleAppointment(
            @PathVariable Long id, @Valid @RequestBody AppointmentRescheduleRequest request) {
        AppointmentResponse res = appointmentService.rescheduleAppointment(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Appointment rescheduled successfully", res));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancelAppointment(
            @PathVariable Long id, @RequestParam(required = false) String reason) {
        AppointmentResponse res = appointmentService.updateAppointmentStatus(id, AppointmentStatus.CANCELLED, reason);
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled successfully", res));
    }
}
