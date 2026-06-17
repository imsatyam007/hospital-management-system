package com.example.demo.service;

import com.example.demo.entity.Bill;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfInvoiceService {

    public byte[] generateInvoice(Bill bill) {

        try {

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            Document document =
                    new Document();

            PdfWriter.getInstance(
                    document,
                    out
            );

            document.open();

            document.add(
                    new Paragraph(
                            "HMS HOSPITAL"
                    )
            );

            document.add(
                    new Paragraph(
                            "Invoice #" +
                            bill.getBillId()
                    )
            );

            document.add(
                    new Paragraph(" ")
            );

            document.add(
                    new Paragraph(
                            "Patient: "
                            + bill.getPatient()
                            .getFullName()
                    )
            );

            document.add(
                    new Paragraph(
                            "Doctor: "
                            + bill.getDoctor()
                            .getFullName()
                    )
            );

            document.add(
                    new Paragraph(
                            "Consultation Fee: ₹"
                            + bill.getConsultationFee()
                    )
            );

            document.add(
                    new Paragraph(
                            "Test Fee: ₹"
                            + bill.getTestFee()
                    )
            );

            document.add(
                    new Paragraph(
                            "Medicine Fee: ₹"
                            + bill.getMedicineFee()
                    )
            );

            document.add(
                    new Paragraph(
                            "Total Amount: ₹"
                            + bill.getTotalAmount()
                    )
            );

            document.add(
                    new Paragraph(
                            "Status: "
                            + bill.getPaymentStatus()
                    )
            );

            document.close();

            return out.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}