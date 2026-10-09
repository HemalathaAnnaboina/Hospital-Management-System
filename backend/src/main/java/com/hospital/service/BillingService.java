package com.hospital.service;

import com.hospital.dto.request.BillGenerationRequest;
import com.hospital.dto.response.BillResponse;
import com.hospital.entity.PaymentStatus;
import java.util.List;

public interface BillingService {
    BillResponse generateBill(BillGenerationRequest request);
    BillResponse getBillById(Long id);
    BillResponse getBillByAppointment(Long appointmentId);
    List<BillResponse> getBillsByPatient(Long patientId);
    List<BillResponse> getAllBills(PaymentStatus status);
    BillResponse updatePaymentStatus(Long billId, PaymentStatus status, String paymentMethod);
}
