package com.example.demo.dto;

import java.time.LocalDateTime;

public class PaymentHistoryDTO {

    private Long paymentId;

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private Double amount;

    private String paymentStatus;

    private LocalDateTime paymentDate;

    private Long billId;

    private String patientName;

    private String doctorName;

    public PaymentHistoryDTO() {
    }

    public PaymentHistoryDTO(
            Long paymentId,
            String razorpayPaymentId,
            String razorpayOrderId,
            Double amount,
            String paymentStatus,
            LocalDateTime paymentDate,
            Long billId,
            String patientName,
            String doctorName
    ) {
        this.paymentId = paymentId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.paymentDate = paymentDate;
        this.billId = billId;
        this.patientName = patientName;
        this.doctorName = doctorName;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }
}