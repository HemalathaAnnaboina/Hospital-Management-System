package com.hospital.service.impl;

import com.hospital.dto.request.MedicineItemDto;
import com.hospital.dto.request.PrescriptionRequest;
import com.hospital.dto.response.PrescriptionResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;
import com.hospital.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Override
    @Transactional
    public PrescriptionResponse createPrescription(PrescriptionRequest request, Long doctorUserId) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + request.getAppointmentId()));

        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("You are not assigned as the doctor for this appointment.");
        }

        if (prescriptionRepository.existsByAppointmentId(appointment.getId())) {
            throw new BadRequestException("A prescription already exists for this appointment.");
        }

        String rxNumber = "RX-" + System.currentTimeMillis() % 10000000;

        Prescription prescription = new Prescription(
                rxNumber,
                appointment.getPatient(),
                doctor,
                appointment,
                request.getNotes()
        );

        if (request.getMedicines() != null) {
            for (MedicineItemDto item : request.getMedicines()) {
                Medicine med = null;
                if (item.getMedicineId() != null) {
                    med = medicineRepository.findById(item.getMedicineId()).orElse(null);
                }

                PrescriptionMedicine pm = new PrescriptionMedicine(
                        med,
                        item.getMedicineName(),
                        item.getDosage(),
                        item.getFrequency(),
                        item.getDuration(),
                        item.getInstructions()
                );
                prescription.addMedicine(pm);
            }
        }

        Prescription saved = prescriptionRepository.save(prescription);
        return PrescriptionResponse.fromEntity(saved);
    }

    @Override
    public PrescriptionResponse getPrescriptionByAppointment(Long appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found for appointment: " + appointmentId));
        return PrescriptionResponse.fromEntity(prescription);
    }

    @Override
    public List<PrescriptionResponse> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(PrescriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + doctorUserId));

        return prescriptionRepository.findByDoctorIdOrderByCreatedAtDesc(doctor.getId()).stream()
                .map(PrescriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
