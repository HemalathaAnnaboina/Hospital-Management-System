package com.hospital.controller;

import com.hospital.dto.request.BillGenerationRequest;
import com.hospital.dto.response.ApiResponse;
import com.hospital.dto.response.BillResponse;
import com.hospital.entity.PaymentStatus;
import com.hospital.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillingService billingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<BillResponse>> generateBill(@Valid @RequestBody BillGenerationRequest request) {
        BillResponse res = billingService.generateBill(request);
        return ResponseEntity.ok(ApiResponse.ok("Bill generated successfully", res));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<BillResponse>> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Bill retrieved", billingService.getBillById(id)));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<BillResponse>> getBillByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(ApiResponse.ok("Bill retrieved", billingService.getBillByAppointment(appointmentId)));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getBillsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok("Patient bills retrieved", billingService.getBillsByPatient(patientId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BillResponse>>> getAllBills(
            @RequestParam(required = false) PaymentStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Bills retrieved", billingService.getAllBills(status)));
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<BillResponse>> payBill(
            @PathVariable Long id,
            @RequestParam(defaultValue = "CASH") String paymentMethod) {
        BillResponse res = billingService.updatePaymentStatus(id, PaymentStatus.PAID, paymentMethod);
        return ResponseEntity.ok(ApiResponse.ok("Payment processed successfully", res));
    }
}
