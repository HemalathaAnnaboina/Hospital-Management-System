package com.hospital.service.impl;

import com.hospital.dto.request.DepartmentRequest;
import com.hospital.entity.Department;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public List<Department> getAllActiveDepartments() {
        return departmentRepository.findByActiveTrue();
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    @Override
    @Transactional
    public Department createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department with name '" + request.getName() + "' already exists");
        }
        Department dept = new Department(request.getName(), request.getDescription());
        if (request.getActive() != null) {
            dept.setActive(request.getActive());
        }
        return departmentRepository.save(dept);
    }

    @Override
    @Transactional
    public Department updateDepartment(Long id, DepartmentRequest request) {
        Department dept = getDepartmentById(id);
        if (!dept.getName().equalsIgnoreCase(request.getName()) && departmentRepository.existsByName(request.getName())) {
            throw new BadRequestException("Department with name '" + request.getName() + "' already exists");
        }
        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        if (request.getActive() != null) {
            dept.setActive(request.getActive());
        }
        return departmentRepository.save(dept);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = getDepartmentById(id);
        dept.setActive(false); // soft delete
        departmentRepository.save(dept);
    }
}
