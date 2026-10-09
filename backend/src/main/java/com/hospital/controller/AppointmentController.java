package com.hospital.controller;

import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.service.AppointmentService;
import com.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/appointments/available-slots")
    public ResponseEntity<ApiResponse<List<LocalTime>>> getAvailableSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<LocalTime> slots = appointmentService.getAvailableSlots(doctorId, date);
        return ResponseEntity.ok(ApiResponse.ok("Available slots retrieved", slots));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getActiveDoctors(
            @RequestParam(required = false) Long departmentId) {
        List<DoctorResponse> doctors = departmentId != null ?
                doctorService.getDoctorsByDepartment(departmentId) :
                doctorService.getAllActiveDoctors();
        return ResponseEntity.ok(ApiResponse.ok("Doctors retrieved", doctors));
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Doctor details retrieved", doctorService.getDoctorById(id)));
    }
}
