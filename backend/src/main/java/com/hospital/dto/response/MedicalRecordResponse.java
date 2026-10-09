package com.hospital.dto.response;

import com.hospital.entity.MedicalRecord;
import java.time.LocalDateTime;

public class MedicalRecordResponse {

    private Long id;
    private String recordNumber;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private Long appointmentId;
    private String appointmentNumber;
    private String symptoms;
    private String diagnosis;
    private String notes;
    private LocalDateTime createdAt;

    public MedicalRecordResponse() {
    }

    public static MedicalRecordResponse fromEntity(MedicalRecord r) {
        MedicalRecordResponse res = new MedicalRecordResponse();
        res.setId(r.getId());
        res.setRecordNumber(r.getRecordNumber());

        if (r.getPatient() != null) {
            res.setPatientId(r.getPatient().getId());
            if (r.getPatient().getUser() != null) {
                res.setPatientName(r.getPatient().getUser().getFullName());
            }
        }

        if (r.getDoctor() != null) {
            res.setDoctorId(r.getDoctor().getId());
            res.setDoctorSpecialization(r.getDoctor().getSpecialization());
            if (r.getDoctor().getUser() != null) {
                res.setDoctorName(r.getDoctor().getUser().getFullName());
            }
        }

        if (r.getAppointment() != null) {
            res.setAppointmentId(r.getAppointment().getId());
            res.setAppointmentNumber(r.getAppointment().getAppointmentNumber());
        }

        res.setSymptoms(r.getSymptoms());
        res.setDiagnosis(r.getDiagnosis());
        res.setNotes(r.getNotes());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecordNumber() {
        return recordNumber;
    }

    public void setRecordNumber(String recordNumber) {
        this.recordNumber = recordNumber;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpecialization() {
        return doctorSpecialization;
    }

    public void setDoctorSpecialization(String doctorSpecialization) {
        this.doctorSpecialization = doctorSpecialization;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getAppointmentNumber() {
        return appointmentNumber;
    }

    public void setAppointmentNumber(String appointmentNumber) {
        this.appointmentNumber = appointmentNumber;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
