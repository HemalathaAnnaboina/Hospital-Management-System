package com.hospital.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PrescriptionRequest {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    private String notes;

    @NotEmpty(message = "At least one medicine is required")
    @Valid
    private List<MedicineItemDto> medicines;

    public PrescriptionRequest() {
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<MedicineItemDto> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<MedicineItemDto> medicines) {
        this.medicines = medicines;
    }
}
