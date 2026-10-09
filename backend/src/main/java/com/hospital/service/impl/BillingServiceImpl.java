package com.hospital.service.impl;

import com.hospital.dto.request.BillGenerationRequest;
import com.hospital.dto.request.BillItemDto;
import com.hospital.dto.response.BillResponse;
import com.hospital.entity.*;
import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.BillRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BillingServiceImpl implements BillingService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public BillResponse generateBill(BillGenerationRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + request.getAppointmentId()));

            // If an active bill already exists for this appointment
            if (billRepository.findByAppointmentId(appointment.getId()).isPresent()) {
                throw new BadRequestException("A bill has already been generated for this appointment.");
            }
        }

        String billNumber = "INV-" + System.currentTimeMillis() % 10000000;

        // Calculate consultation fee from doctor if appointment exists and fee not specified
        BigDecimal consultFee = request.getConsultationFee() != null ? request.getConsultationFee() : BigDecimal.ZERO;
        if (consultFee.compareTo(BigDecimal.ZERO) == 0 && appointment != null && appointment.getDoctor() != null) {
            consultFee = appointment.getDoctor().getConsultationFee();
        }

        Bill bill = new Bill(
                billNumber,
                patient,
                appointment,
                consultFee,
                request.getTestCharges(),
                request.getMedicineCharges(),
                request.getOtherCharges(),
                request.getDiscount()
        );

        // Add itemized bill lines if provided
        if (request.getBillItems() != null) {
            for (BillItemDto itemDto : request.getBillItems()) {
                BillItem item = new BillItem(
                        itemDto.getItemName(),
                        itemDto.getItemType(),
                        itemDto.getQuantity(),
                        itemDto.getUnitPrice()
                );
                bill.addItem(item);
            }
        }

        // Re-verify server-side calculated total amount
        bill.calculateTotal();

        Bill saved = billRepository.save(bill);
        return BillResponse.fromEntity(saved);
    }

    @Override
    public BillResponse getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return BillResponse.fromEntity(bill);
    }

    @Override
    public BillResponse getBillByAppointment(Long appointmentId) {
        Bill bill = billRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found for appointment: " + appointmentId));
        return BillResponse.fromEntity(bill);
    }

    @Override
    public List<BillResponse> getBillsByPatient(Long patientId) {
        return billRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(BillResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<BillResponse> getAllBills(PaymentStatus status) {
        if (status != null) {
            return billRepository.findByPaymentStatusOrderByCreatedAtDesc(status).stream()
                    .map(BillResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        return billRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BillResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BillResponse updatePaymentStatus(Long billId, PaymentStatus status, String paymentMethod) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + billId));

        bill.setPaymentStatus(status);
        if (status == PaymentStatus.PAID) {
            bill.setPaidAt(LocalDateTime.now());
            if (paymentMethod != null && !paymentMethod.trim().isEmpty()) {
                bill.setPaymentMethod(paymentMethod.trim());
            }
        }
        Bill saved = billRepository.save(bill);
        return BillResponse.fromEntity(saved);
    }
}
