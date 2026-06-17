package com.example.demo.controller;

import com.example.demo.entity.Bill;
import com.example.demo.entity.Doctor;
import com.example.demo.entity.Patient;
import com.example.demo.repository.BillRepository;
import com.example.demo.repository.DoctorRepository;
import com.example.demo.repository.PatientRepository;
import com.example.demo.service.InvoiceEmailService;
import com.example.demo.service.PdfInvoiceService;

import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PdfInvoiceService pdfInvoiceService;
    private final InvoiceEmailService invoiceEmailService;
    

    public BillController(
            BillRepository billRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            PdfInvoiceService pdfInvoiceService,
            InvoiceEmailService invoiceEmailService) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.pdfInvoiceService = pdfInvoiceService;
        this.invoiceEmailService =invoiceEmailService;
    }

    @PostMapping
    public Bill createBill(@RequestBody Bill bill) {
        Patient patient = patientRepository
                .findById(bill.getPatient().getPatientId())
                .orElseThrow();

        Doctor doctor = doctorRepository
                .findById(bill.getDoctor().getDoctorId())
                .orElseThrow();

        bill.setPatient(patient);
        bill.setDoctor(doctor);

        bill.setTotalAmount(
                bill.getConsultationFee()
                + bill.getTestFee()
                + bill.getMedicineFee()
        );

        return billRepository.save(bill);
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<Bill> getPatientBills(
            @PathVariable Long patientId) {
        return billRepository.findByPatientPatientId(patientId);
    } // Fix: closed getPatientBills here

    // Fix: moved downloadInvoice outside getPatientBills
    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(
            @PathVariable Long id) {

        Bill bill = billRepository
                .findById(id)
                .orElseThrow();

        byte[] pdf = pdfInvoiceService.generateInvoice(bill);

        return ResponseEntity.ok()
                .header(
                    "Content-Disposition",
                    "attachment; filename=invoice.pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/{id}/invoice/view")
public ResponseEntity<byte[]> viewInvoice(
        @PathVariable Long id
) {

    Bill bill =
            billRepository
                    .findById(id)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Bill not found"
                            )
                    );

    byte[] pdf =
            pdfInvoiceService.generateInvoice(
                    bill
            );

    HttpHeaders headers =
            new HttpHeaders();

    headers.setContentType(
            MediaType.APPLICATION_PDF
    );

    headers.add(
            HttpHeaders.CONTENT_DISPOSITION,
            "inline; filename=invoice.pdf"
    );

    return ResponseEntity.ok()
            .headers(headers)
            .body(pdf);
}

    @PostMapping("/{id}/email")
public String emailInvoice(
        @PathVariable Long id
) {

    Bill bill =
            billRepository
                    .findById(id)
                    .orElseThrow();

    byte[] pdf =
            pdfInvoiceService
                    .generateInvoice(bill);

    invoiceEmailService.sendInvoice(

            bill.getPatient()
                    .getEmail(),

            bill.getPatient()
                    .getFullName(),

            pdf
    );

    return "Invoice emailed successfully";
}
}