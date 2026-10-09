package com.hospital.service;

import com.hospital.dto.request.DepartmentRequest;
import com.hospital.entity.Department;
import java.util.List;

public interface DepartmentService {
    List<Department> getAllActiveDepartments();
    List<Department> getAllDepartments();
    Department getDepartmentById(Long id);
    Department createDepartment(DepartmentRequest request);
    Department updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
}
