package com.example.demo.dto;

public class ReviewReportRequest {

    private Long fileId;

    private String doctorRemarks;

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
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