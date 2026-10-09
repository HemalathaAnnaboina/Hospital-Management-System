package com.hospital.dto.response;

import com.hospital.entity.Patient;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;
    private String medicalHistorySummary;
    private LocalDateTime createdAt;

    public PatientResponse() {
    }

    public static PatientResponse fromEntity(Patient patient) {
        PatientResponse res = new PatientResponse();
        res.setId(patient.getId());
        if (patient.getUser() != null) {
            res.setUserId(patient.getUser().getId());
            res.setFullName(patient.getUser().getFullName());
            res.setEmail(patient.getUser().getEmail());
            res.setPhone(patient.getUser().getPhone());
            res.setAddress(patient.getUser().getAddress());
        }
        res.setDateOfBirth(patient.getDateOfBirth());
        res.setGender(patient.getGender());
        res.setBloodGroup(patient.getBloodGroup());
        res.setEmergencyContact(patient.getEmergencyContact());
        res.setMedicalHistorySummary(patient.getMedicalHistorySummary());
        res.setCreatedAt(patient.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getMedicalHistorySummary() {
        return medicalHistorySummary;
    }

    public void setMedicalHistorySummary(String medicalHistorySummary) {
        this.medicalHistorySummary = medicalHistorySummary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
