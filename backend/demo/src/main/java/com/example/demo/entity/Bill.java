package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long billId;

    private Double consultationFee;

    private Double testFee;

    private Double medicineFee;

    private Double totalAmount;

    private String paymentStatus;

    private LocalDate billDate;

    private Double appointmentFee;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    public Appointment getAppointment() {
    return appointment;
    }

        public void setAppointment(
             Appointment appointment
    ) {
            this.appointment = appointment;
    }


@OneToOne(
    mappedBy = "bill",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
@JsonManagedReference
private Payment payment;

public Payment getPayment() {
    return payment;
}

public void setPayment(
        Payment payment
) {
    this.payment = payment;
}

    public Bill() {
    }

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public Double getTestFee() {
        return testFee;
    }

    public void setTestFee(Double testFee) {
        this.testFee = testFee;
    }

    public Double getMedicineFee() {
        return medicineFee;
    }

    public void setMedicineFee(Double medicineFee) {
        this.medicineFee = medicineFee;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Double getAppointmentFee() {
    return appointmentFee;
}

public void setAppointmentFee(
        Double appointmentFee
) {
    this.appointmentFee = appointmentFee;
}
}