package com.hospital.service;

import com.hospital.dto.request.ProfileUpdateRequest;
import com.hospital.dto.request.RegisterRequest;
import com.hospital.dto.response.PatientResponse;
import com.hospital.entity.Patient;
import java.util.List;

public interface PatientService {
    List<PatientResponse> getAllPatients();
    List<PatientResponse> searchPatients(String query);
    PatientResponse getPatientById(Long id);
    PatientResponse getPatientByUserId(Long userId);
    PatientResponse updatePatientProfile(Long userId, ProfileUpdateRequest request);
    PatientResponse registerPatientByStaff(RegisterRequest request);
    Patient getPatientEntity(Long id);
}
