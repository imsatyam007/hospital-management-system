package com.example.demo.controller;

import com.example.demo.entity.MedicalFile;
import com.example.demo.entity.Patient;
import com.example.demo.repository.MedicalFileRepository;
import com.example.demo.repository.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Appointment;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.BillRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List; // Fix: missing import

import com.example.demo.dto.ReviewReportRequest;
import com.example.demo.entity.Bill;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private MedicalFileRepository medicalFileRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public List<MedicalFile> getAllFiles() {
        return medicalFileRepository.findAll();
    }

    @PostMapping("/review")
public ResponseEntity<?> reviewReport(
        @RequestBody
        ReviewReportRequest request
) {

    MedicalFile file =
            medicalFileRepository
                    .findById(
                            request.getFileId()
                    )
                    .orElseThrow();

    file.setReviewStatus(
            "REVIEWED"
    );

    file.setDoctorRemarks(
            request.getDoctorRemarks()
    );

    medicalFileRepository.save(file);

    Bill bill =
            billRepository
                    .findByAppointment(
                            file.getAppointment()
                    )
                    .orElseThrow();

    bill.setPaymentStatus(
            "PENDING_PAYMENT"
    );

    billRepository.save(
            bill
    );

    return ResponseEntity.ok(
            "Report Reviewed"
    );
}

   @PostMapping("/upload")
public ResponseEntity<?> uploadFile(
        @RequestParam("files") MultipartFile[] files,
        @RequestParam("patientId") Long patientId,
        @RequestParam("appointmentId") Long appointmentId
) throws IOException {

    // ✅ Use absolute path to your project's uploads folder
    String absoluteUploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
    System.out.println("UPLOAD API CALLED");

    // ✅ Create the directory if it doesn't exist
    File uploadDirFile = new File(absoluteUploadDir);
    if (!uploadDirFile.exists()) {
        uploadDirFile.mkdirs();
    }

    Patient patient = patientRepository
            .findById(patientId)
            .orElseThrow();

            Appointment appointment =
        appointmentRepository
                .findById(appointmentId)
                .orElseThrow();

                System.out.println(
                    "PATIENT ID = " + patientId
                );

                System.out.println(
                    "APPOINTMENT ID = " + appointmentId
                );

    for (MultipartFile file : files) {
        String fileName = file.getOriginalFilename();
        String filePath = absoluteUploadDir + fileName;

        File dest = new File(filePath);
        file.transferTo(dest);

        MedicalFile medicalFile = new MedicalFile();
        medicalFile.setFileName(fileName);
        medicalFile.setFileType(file.getContentType());
        medicalFile.setFilePath(filePath);
        medicalFile.setUploadedAt(LocalDateTime.now());
        medicalFile.setPatient(patient);
        medicalFile.setAppointment(appointment);
        medicalFileRepository.save(medicalFile);
    }

    return ResponseEntity.ok("File uploaded successfully");
}
}