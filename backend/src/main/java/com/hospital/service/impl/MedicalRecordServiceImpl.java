package com.hospital.service.impl;

import com.hospital.dto.request.MedicalRecordRequest;
import com.hospital.dto.response.MedicalRecordResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    @Transactional
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request, Long doctorUserId) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + request.getAppointmentId()));

        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("You are not assigned as the doctor for this appointment.");
        }

        if (medicalRecordRepository.existsByAppointmentId(appointment.getId())) {
            throw new BadRequestException("A medical record has already been created for this appointment.");
        }

        String recordNumber = "MR-" + System.currentTimeMillis() % 10000000;

        MedicalRecord record = new MedicalRecord(
                recordNumber,
                appointment.getPatient(),
                doctor,
                appointment,
                request.getSymptoms(),
                request.getDiagnosis(),
                request.getNotes()
        );

        MedicalRecord saved = medicalRecordRepository.save(record);

        // Mark appointment as COMPLETED
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return MedicalRecordResponse.fromEntity(saved);
    }

    @Override
    public MedicalRecordResponse getRecordByAppointment(Long appointmentId) {
        MedicalRecord record = medicalRecordRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found for appointment: " + appointmentId));
        return MedicalRecordResponse.fromEntity(record);
    }

    @Override
    public List<MedicalRecordResponse> getRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(MedicalRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordResponse> getRecordsByDoctor(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        return medicalRecordRepository.findByDoctorIdOrderByCreatedAtDesc(doctor.getId()).stream()
                .map(MedicalRecordResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
