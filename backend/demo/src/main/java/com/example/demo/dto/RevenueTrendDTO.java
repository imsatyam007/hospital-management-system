package com.example.demo.dto;

public class RevenueTrendDTO {

    private String date;
    private Double revenue;

    public RevenueTrendDTO(
            String date,
            Double revenue
    ) {
        this.date = date;
        this.revenue = revenue;
    }

    public String getDate() {
        return date;
    }

    public Double getRevenue() {
        return revenue;
    }
}