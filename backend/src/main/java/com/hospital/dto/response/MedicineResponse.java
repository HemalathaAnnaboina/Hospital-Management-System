package com.hospital.dto.response;

import com.hospital.entity.Medicine;
import java.math.BigDecimal;

public class MedicineResponse {

    private Long id;
    private String name;
    private String genericName;
    private String category;
    private String dosageForm;
    private String strength;
    private BigDecimal unitPrice;
    private Integer stockQuantity;
    private boolean active;

    public MedicineResponse() {
    }

    public static MedicineResponse fromEntity(Medicine m) {
        MedicineResponse res = new MedicineResponse();
        res.setId(m.getId());
        res.setName(m.getName());
        res.setGenericName(m.getGenericName());
        res.setCategory(m.getCategory());
        res.setDosageForm(m.getDosageForm());
        res.setStrength(m.getStrength());
        res.setUnitPrice(m.getUnitPrice());
        res.setStockQuantity(m.getStockQuantity());
        res.setActive(m.isActive());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDosageForm() {
        return dosageForm;
    }

    public void setDosageForm(String dosageForm) {
        this.dosageForm = dosageForm;
    }

    public String getStrength() {
        return strength;
    }

    public void setStrength(String strength) {
        this.strength = strength;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
