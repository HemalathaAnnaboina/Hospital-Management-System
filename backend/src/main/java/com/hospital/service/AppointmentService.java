package com.hospital.service;

import com.hospital.dto.request.AppointmentBookingRequest;
import com.hospital.dto.request.AppointmentRescheduleRequest;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.entity.Appointment;
import com.hospital.entity.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(AppointmentBookingRequest request, Long currentUserId);
    AppointmentResponse rescheduleAppointment(Long id, AppointmentRescheduleRequest request);
    AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status, String cancellationReason);
    AppointmentResponse cancelAppointmentByPatient(Long id, Long currentUserId, String reason);
    List<AppointmentResponse> getAppointmentsByPatient(Long patientId);
    List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentResponse> getTodayAppointmentsByDoctor(Long doctorId);
    List<AppointmentResponse> getTodayAppointments();
    List<AppointmentResponse> getAllAppointments();
    List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date);
    Appointment getAppointmentEntity(Long id);
}
