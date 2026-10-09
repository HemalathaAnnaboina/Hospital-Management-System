package com.hospital.service;

import com.hospital.dto.request.PrescriptionRequest;
import com.hospital.dto.response.PrescriptionResponse;
import java.util.List;

public interface PrescriptionService {
    PrescriptionResponse createPrescription(PrescriptionRequest request, Long doctorUserId);
    PrescriptionResponse getPrescriptionByAppointment(Long appointmentId);
    List<PrescriptionResponse> getPrescriptionsByPatient(Long patientId);
    List<PrescriptionResponse> getPrescriptionsByDoctor(Long doctorUserId);
}
