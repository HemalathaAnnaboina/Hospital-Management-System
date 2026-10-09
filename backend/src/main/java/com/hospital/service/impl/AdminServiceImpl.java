package com.hospital.service.impl;

import com.hospital.dto.response.DashboardStatsResponse;
import com.hospital.entity.AppointmentStatus;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        long totalDoctors = doctorRepository.countByActiveTrue();
        long totalPatients = patientRepository.count();
        long todayAppointments = appointmentRepository.countByAppointmentDate(LocalDate.now());
        long completedAppointments = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long booked = appointmentRepository.countByStatus(AppointmentStatus.BOOKED);
        long confirmed = appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long pendingAppointments = booked + confirmed;
        long totalAppointments = appointmentRepository.count();
        long totalDepartments = departmentRepository.count();

        return new DashboardStatsResponse(
                totalDoctors,
                totalPatients,
                todayAppointments,
                completedAppointments,
                pendingAppointments,
                totalAppointments,
                totalDepartments
        );
    }
}
