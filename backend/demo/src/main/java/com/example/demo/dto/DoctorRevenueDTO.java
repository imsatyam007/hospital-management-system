package com.example.demo.dto;

public class DoctorRevenueDTO {

    private String doctorName;
    private Double revenue;

    public DoctorRevenueDTO(
            String doctorName,
            Double revenue
    ) {
        this.doctorName = doctorName;
        this.revenue = revenue;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public Double getRevenue() {
        return revenue;
    }
}