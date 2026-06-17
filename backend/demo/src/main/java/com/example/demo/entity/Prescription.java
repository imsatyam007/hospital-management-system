package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;

    private String medicine;

    private String dosage;

    private String instructions;

    private LocalDate prescribedDate;

    private Double medicineFee;

    private Double testFee;

    private String requiredTests;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    public Prescription() {
    }

    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public String getMedicine() {
        return medicine;
    }

    public void setMedicine(String medicine) {
        this.medicine = medicine;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public LocalDate getPrescribedDate() {
        return prescribedDate;
    }

    public void setPrescribedDate(LocalDate prescribedDate) {
        this.prescribedDate = prescribedDate;
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

    public Appointment getAppointment() {
    return appointment;
    }

    public void setAppointment(
        Appointment appointment
    ) {
        this.appointment = appointment;
    }

    public String getRequiredTests() {
    return requiredTests;
}

public void setRequiredTests(
        String requiredTests
) {
    this.requiredTests = requiredTests;
}

public Double getMedicineFee() {
    return medicineFee;
}

public void setMedicineFee(
        Double medicineFee
) {
    this.medicineFee = medicineFee;
}

public Double getTestFee() {
    return testFee;
}

public void setTestFee(
        Double testFee
) {
    this.testFee = testFee;
}


}