package com.hospital.service.impl;

import com.hospital.dto.request.AppointmentBookingRequest;
import com.hospital.dto.request.AppointmentRescheduleRequest;
import com.hospital.dto.response.AppointmentResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.exception.SlotAlreadyBookedException;
import com.hospital.exception.UnauthorizedAccessException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentBookingRequest request, Long currentUserId) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        if (!doctor.isActive()) {
            throw new BadRequestException("Doctor is currently inactive for appointments.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        Patient patient;
        if (request.getPatientId() != null) {
            patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        } else {
            patient = patientRepository.findByUserId(currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + currentUserId));
        }

        LocalDate date = request.getAppointmentDate();
        LocalTime time = request.getAppointmentTime();

        // 1. Validate appointment date is not in the past
        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date cannot be in the past.");
        }

        // 2. CRITICAL BACKEND DOUBLE-BOOKING CHECK:
        // Check if this doctor already has an active (non-cancelled) appointment at this date & time
        boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor.getId(), date, time, AppointmentStatus.CANCELLED
        );

        if (isSlotTaken) {
            throw new SlotAlreadyBookedException(
                    "Doctor " + (doctor.getUser() != null ? doctor.getUser().getFullName() : "") +
                    " is already booked for " + date + " at " + time + ". Please choose another time slot."
            );
        }

        String appointmentNumber = "APT-" + System.currentTimeMillis() % 10000000;

        Appointment appointment = new Appointment(
                appointmentNumber,
                patient,
                doctor,
                department,
                date,
                time,
                request.getReason()
        );

        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public AppointmentResponse rescheduleAppointment(Long id, AppointmentRescheduleRequest request) {
        Appointment appointment = getAppointmentEntity(id);

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Completed appointments cannot be rescheduled.");
        }

        LocalDate newDate = request.getAppointmentDate();
        LocalTime newTime = request.getAppointmentTime();

        if (newDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Reschedule date cannot be in the past.");
        }

        // Check if target slot is taken by another appointment for this doctor
        boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotAndIdNot(
                appointment.getDoctor().getId(), newDate, newTime, AppointmentStatus.CANCELLED, id
        );

        if (isSlotTaken) {
            throw new SlotAlreadyBookedException(
                    "Selected slot " + newDate + " at " + newTime + " is already booked for this doctor."
            );
        }

        appointment.setAppointmentDate(newDate);
        appointment.setAppointmentTime(newTime);
        appointment.setStatus(AppointmentStatus.BOOKED);
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, AppointmentStatus status, String cancellationReason) {
        Appointment appointment = getAppointmentEntity(id);
        appointment.setStatus(status);
        if (status == AppointmentStatus.CANCELLED && cancellationReason != null) {
            appointment.setCancellationReason(cancellationReason);
        }
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public AppointmentResponse cancelAppointmentByPatient(Long id, Long currentUserId, String reason) {
        Appointment appointment = getAppointmentEntity(id);
        Patient patient = patientRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + currentUserId));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to cancel this appointment.");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel an already completed appointment.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(reason != null ? reason : "Cancelled by patient");
        Appointment saved = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(saved);
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patientId).stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId).stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getTodayAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(doctorId, LocalDate.now()).stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getTodayAppointments() {
        return appointmentRepository.findByAppointmentDateOrderByAppointmentTimeAsc(LocalDate.now()).stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(AppointmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        LocalTime from = doctor.getAvailableFrom() != null ? doctor.getAvailableFrom() : LocalTime.of(9, 0);
        LocalTime to = doctor.getAvailableTo() != null ? doctor.getAvailableTo() : LocalTime.of(17, 0);

        // Fetch already booked slots for this doctor on this date
        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByAppointmentTimeAsc(doctorId, date);

        Set<LocalTime> bookedTimes = bookedAppointments.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toSet());

        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = from;
        while (current.isBefore(to)) {
            if (!bookedTimes.contains(current)) {
                // If checking for today, don't show past hours
                if (!date.equals(LocalDate.now()) || current.isAfter(LocalTime.now())) {
                    slots.add(current);
                }
            }
            current = current.plusMinutes(30);
        }

        return slots;
    }

    @Override
    public Appointment getAppointmentEntity(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }
}
