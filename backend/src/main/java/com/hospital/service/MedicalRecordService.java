package com.hospital.service;

import com.hospital.dto.request.MedicalRecordRequest;
import com.hospital.dto.response.MedicalRecordResponse;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request, Long doctorUserId);
    MedicalRecordResponse getRecordByAppointment(Long appointmentId);
    List<MedicalRecordResponse> getRecordsByPatient(Long patientId);
    List<MedicalRecordResponse> getRecordsByDoctor(Long doctorUserId);
}
