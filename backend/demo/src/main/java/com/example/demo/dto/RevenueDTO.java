package com.example.demo.dto;

public class RevenueDTO {

    private Double totalRevenue;

    private Double paidRevenue;

    private Double pendingRevenue;

    private Long totalBills;

    public RevenueDTO(
            Double totalRevenue,
            Double paidRevenue,
            Double pendingRevenue,
            Long totalBills
    ) {
        this.totalRevenue = totalRevenue;
        this.paidRevenue = paidRevenue;
        this.pendingRevenue = pendingRevenue;
        this.totalBills = totalBills;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public Double getPaidRevenue() {
        return paidRevenue;
    }

    public Double getPendingRevenue() {
        return pendingRevenue;
    }

    public Long getTotalBills() {
        return totalBills;
    }
}
