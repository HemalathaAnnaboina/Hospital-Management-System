package com.hospital.dto.response;

import com.hospital.entity.Bill;
import com.hospital.entity.BillItem;
import com.hospital.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BillResponse {

    private Long id;
    private String billNumber;
    private Long patientId;
    private String patientName;
    private String patientPhone;
    private Long appointmentId;
    private String appointmentNumber;
    private BigDecimal consultationFee;
    private BigDecimal testCharges;
    private BigDecimal medicineCharges;
    private BigDecimal otherCharges;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
    private List<BillItemDetail> billItems = new ArrayList<>();

    public static class BillItemDetail {
        private Long id;
        private String itemName;
        private String itemType;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal amount;

        public BillItemDetail() {
        }

        public BillItemDetail(Long id, String itemName, String itemType, Integer quantity,
                              BigDecimal unitPrice, BigDecimal amount) {
            this.id = id;
            this.itemName = itemName;
            this.itemType = itemType;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.amount = amount;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public String getItemType() {
            return itemType;
        }

        public void setItemType(String itemType) {
            this.itemType = itemType;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }

    public BillResponse() {
    }

    public static BillResponse fromEntity(Bill b) {
        BillResponse res = new BillResponse();
        res.setId(b.getId());
        res.setBillNumber(b.getBillNumber());

        if (b.getPatient() != null) {
            res.setPatientId(b.getPatient().getId());
            if (b.getPatient().getUser() != null) {
                res.setPatientName(b.getPatient().getUser().getFullName());
                res.setPatientPhone(b.getPatient().getUser().getPhone());
            }
        }

        if (b.getAppointment() != null) {
            res.setAppointmentId(b.getAppointment().getId());
            res.setAppointmentNumber(b.getAppointment().getAppointmentNumber());
        }

        res.setConsultationFee(b.getConsultationFee());
        res.setTestCharges(b.getTestCharges());
        res.setMedicineCharges(b.getMedicineCharges());
        res.setOtherCharges(b.getOtherCharges());
        res.setDiscount(b.getDiscount());
        res.setTotalAmount(b.getTotalAmount());
        res.setPaymentStatus(b.getPaymentStatus());
        res.setPaymentMethod(b.getPaymentMethod());
        res.setPaidAt(b.getPaidAt());
        res.setCreatedAt(b.getCreatedAt());

        if (b.getBillItems() != null) {
            List<BillItemDetail> items = new ArrayList<>();
            for (BillItem item : b.getBillItems()) {
                items.add(new BillItemDetail(
                        item.getId(),
                        item.getItemName(),
                        item.getItemType(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getAmount()
                ));
            }
            res.setBillItems(items);
        }

        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(String billNumber) {
        this.billNumber = billNumber;
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

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
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

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public BigDecimal getTestCharges() {
        return testCharges;
    }

    public void setTestCharges(BigDecimal testCharges) {
        this.testCharges = testCharges;
    }

    public BigDecimal getMedicineCharges() {
        return medicineCharges;
    }

    public void setMedicineCharges(BigDecimal medicineCharges) {
        this.medicineCharges = medicineCharges;
    }

    public BigDecimal getOtherCharges() {
        return physicalOtherCharges();
    }

    private BigDecimal physicalOtherCharges() {
        return otherCharges;
    }

    public void setOtherCharges(BigDecimal otherCharges) {
        this.otherCharges = otherCharges;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<BillItemDetail> getBillItems() {
        return billItems;
    }

    public void setBillItems(List<BillItemDetail> billItems) {
        this.billItems = billItems;
    }
}
