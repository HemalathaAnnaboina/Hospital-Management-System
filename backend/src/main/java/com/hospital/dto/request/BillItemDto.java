package com.hospital.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class BillItemDto {

    @NotBlank(message = "Item name is required")
    private String itemName;

    private String itemType;
    private Integer quantity = 1;

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    public BillItemDto() {
    }

    public BillItemDto(String itemName, String itemType, Integer quantity, BigDecimal unitPrice) {
        this.itemName = itemName;
        this.itemType = itemType;
        this.quantity = quantity != null ? quantity : 1;
        this.unitPrice = unitPrice;
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
}
