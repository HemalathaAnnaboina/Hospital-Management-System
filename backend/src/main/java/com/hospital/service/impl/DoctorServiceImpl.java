package com.hospital.service.impl;

import com.hospital.dto.request.DoctorCreateRequest;
import com.hospital.dto.request.DoctorUpdateRequest;
import com.hospital.dto.response.DoctorResponse;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.entity.Role;
import com.hospital.entity.User;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.UserRepository;
import com.hospital.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<DoctorResponse> getAllActiveDoctors() {
        return doctorRepository.findByActiveTrue().stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponse> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentIdAndActiveTrue(departmentId).stream()
                .map(DoctorResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = getDoctorEntity(id);
        return DoctorResponse.fromEntity(doctor);
    }

    @Override
    public DoctorResponse getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user id: " + userId));
        return DoctorResponse.fromEntity(doctor);
    }

    @Override
    @Transactional
    public DoctorResponse createDoctor(DoctorCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User email already exists: " + request.getEmail());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                request.getAddress(),
                Role.DOCTOR
        );
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor(
                savedUser,
                department,
                request.getSpecialization(),
                request.getQualification(),
                request.getExperienceYears(),
                request.getConsultationFee(),
                request.getRoomNumber(),
                request.getAvailableDays(),
                request.getAvailableFrom(),
                request.getAvailableTo()
        );
        Doctor savedDoctor = doctorRepository.save(doctor);
        return DoctorResponse.fromEntity(savedDoctor);
    }

    @Override
    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorUpdateRequest request) {
        Doctor doctor = getDoctorEntity(id);

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        User user = doctor.getUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        userRepository.save(user);

        doctor.setDepartment(department);
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setRoomNumber(request.getRoomNumber());
        doctor.setAvailableDays(request.getAvailableDays());
        doctor.setAvailableFrom(request.getAvailableFrom());
        doctor.setAvailableTo(request.getAvailableTo());
        if (request.getActive() != null) {
            doctor.setActive(request.getActive());
            user.setActive(request.getActive());
        }

        Doctor savedDoctor = doctorRepository.save(doctor);
        return DoctorResponse.fromEntity(savedDoctor);
    }

    @Override
    @Transactional
    public void toggleDoctorStatus(Long id, boolean active) {
        Doctor doctor = getDoctorEntity(id);
        doctor.setActive(active);
        doctor.getUser().setActive(active);
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());
    }

    @Override
    public Doctor getDoctorEntity(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }
}
