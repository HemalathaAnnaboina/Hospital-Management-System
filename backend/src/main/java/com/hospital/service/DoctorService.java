package com.hospital.service;

import com.hospital.dto.request.DoctorCreateRequest;
import com.hospital.dto.request.DoctorUpdateRequest;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.entity.Doctor;
import java.util.List;

public interface DoctorService {
    List<DoctorResponse> getAllActiveDoctors();
    List<DoctorResponse> getAllDoctors();
    List<DoctorResponse> getDoctorsByDepartment(Long departmentId);
    DoctorResponse getDoctorById(Long id);
    DoctorResponse getDoctorByUserId(Long userId);
    DoctorResponse createDoctor(DoctorCreateRequest request);
    DoctorResponse updateDoctor(Long id, DoctorUpdateRequest request);
    void toggleDoctorStatus(Long id, boolean active);
    Doctor getDoctorEntity(Long id);
}
