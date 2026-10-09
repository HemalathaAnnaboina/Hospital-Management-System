package com.hospital.dto.response;

import com.hospital.entity.Prescription;
import com.hospital.entity.PrescriptionMedicine;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PrescriptionResponse {

    private Long id;
    private String prescriptionNumber;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private Long appointmentId;
    private String appointmentNumber;
    private String notes;
    private List<PrescriptionMedicineItem> medicines = new ArrayList<>();
    private LocalDateTime createdAt;

    public static class PrescriptionMedicineItem {
        private Long id;
        private Long medicineId;
        private String medicineName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;

        public PrescriptionMedicineItem() {
        }

        public PrescriptionMedicineItem(Long id, Long medicineId, String medicineName, String dosage,
                                      String frequency, String duration, String instructions) {
            this.id = id;
            this.medicineId = medicineId;
            this.medicineName = medicineName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.duration = duration;
            this.instructions = instructions;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getMedicineId() {
            return medicineId;
        }

        public void setMedicineId(Long medicineId) {
            this.medicineId = medicineId;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public void setMedicineName(String medicineName) {
            this.medicineName = medicineName;
        }

        public String getDosage() {
            return dosage;
        }

        public void setDosage(String dosage) {
            this.dosage = dosage;
        }

        public String getFrequency() {
            return frequency;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getInstructions() {
            return instructions;
        }

        public void setInstructions(String instructions) {
            this.instructions = instructions;
        }
    }

    public PrescriptionResponse() {
    }

    public static PrescriptionResponse fromEntity(Prescription p) {
        PrescriptionResponse res = new PrescriptionResponse();
        res.setId(p.getId());
        res.setPrescriptionNumber(p.getPrescriptionNumber());

        if (p.getPatient() != null) {
            res.setPatientId(p.getPatient().getId());
            if (p.getPatient().getUser() != null) {
                res.setPatientName(p.getPatient().getUser().getFullName());
            }
        }

        if (p.getDoctor() != null) {
            res.setDoctorId(p.getDoctor().getId());
            res.setDoctorSpecialization(p.getDoctor().getSpecialization());
            if (p.getDoctor().getUser() != null) {
                res.setDoctorName(p.getDoctor().getUser().getFullName());
            }
        }

        if (p.getAppointment() != null) {
            res.setAppointmentId(p.getAppointment().getId());
            res.setAppointmentNumber(p.getAppointment().getAppointmentNumber());
        }

        res.setNotes(p.getNotes());
        res.setCreatedAt(p.getCreatedAt());

        if (p.getPrescriptionMedicines() != null) {
            List<PrescriptionMedicineItem> items = new ArrayList<>();
            for (PrescriptionMedicine pm : p.getPrescriptionMedicines()) {
                items.add(new PrescriptionMedicineItem(
                        pm.getId(),
                        pm.getMedicine() != null ? pm.getMedicine().getId() : null,
                        pm.getMedicineName(),
                        pm.getDosage(),
                        pm.getFrequency(),
                        pm.getDuration(),
                        pm.getInstructions()
                ));
            }
            res.setMedicines(items);
        }

        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrescriptionNumber() {
        return prescriptionNumber;
    }

    public void setPrescriptionNumber(String prescriptionNumber) {
        this.prescriptionNumber = prescriptionNumber;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<PrescriptionMedicineItem> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<PrescriptionMedicineItem> medicines) {
        this.medicines = medicines;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
