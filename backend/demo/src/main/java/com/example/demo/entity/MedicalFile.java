package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class MedicalFile {

    @Id
    @GeneratedValue(
            strategy =
            GenerationType.IDENTITY
    )
    private Long fileId;

    private String fileName;

    private String fileType;

    private String filePath;

    private LocalDateTime uploadedAt;

    private String reviewStatus;

    @Column(length = 1000)
    private String doctorRemarks;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    public MedicalFile() {
    }

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(
            LocalDateTime uploadedAt
    ) {
        this.uploadedAt = uploadedAt;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Appointment getAppointment() {
    return appointment;
}

public void setAppointment(
        Appointment appointment
) {
    this.appointment = appointment;
}

public String getReviewStatus() {
    return reviewStatus;
}

public void setReviewStatus(
        String reviewStatus
) {
    this.reviewStatus = reviewStatus;
}

public String getDoctorRemarks() {
    return doctorRemarks;
}

public void setDoctorRemarks(
        String doctorRemarks
) {
    this.doctorRemarks = doctorRemarks;
}

}