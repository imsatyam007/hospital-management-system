package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    private LocalDate appointmentDate; // Fix: changed from String to LocalDate

    private String reason;

    private String status; // SCHEDULED / COMPLETED / CANCELLED

    private LocalDateTime createdAt;

    private String appointmentStatus;
    private String paymentStatus;
    private Double appointmentFee;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private DoctorTimeSlot slot;

    @OneToOne(
    mappedBy = "appointment",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
@JsonIgnore
private Bill bill;

    @OneToOne(
    mappedBy = "appointment",
    cascade = CascadeType.ALL,
    orphanRemoval = true
)
@JsonIgnore
private Prescription prescription;

    public Appointment() {}

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public LocalDate getAppointmentDate() { return appointmentDate; } // Fix: LocalDate
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; } // Fix: LocalDate

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public DoctorTimeSlot getSlot() { return slot; }
    public void setSlot(DoctorTimeSlot slot) { this.slot = slot;}

    public String getAppointmentStatus() {
    return appointmentStatus;
}

public void setAppointmentStatus(String appointmentStatus) {
    this.appointmentStatus = appointmentStatus;
}

public String getPaymentStatus() {
    return paymentStatus;
}

public void setPaymentStatus(String paymentStatus) {
    this.paymentStatus = paymentStatus;
}

public Double getAppointmentFee() {
    return appointmentFee;
}

public void setAppointmentFee(Double appointmentFee) {
    this.appointmentFee = appointmentFee;
}

public Bill getBill() {
    return bill;
}

public void setBill(Bill bill) {
    this.bill = bill;
}

public Prescription getPrescription() {
    return prescription;
}

public void setPrescription(Prescription prescription) {
    this.prescription = prescription;
}
}