package com.example.demo.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;

@Service
public class InvoiceEmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendInvoice(
            String toEmail,
            String patientName,
            byte[] pdf
    ) {

        try {

            MimeMessage message =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            message,
                            true
                    );

            helper.setFrom(fromEmail);

            helper.setTo(toEmail);

            helper.setSubject(
                    "Invoice from HMS Hospital"
            );

            helper.setText(
                    "Dear "
                    + patientName
                    + ",\n\n"
                    + "Please find your invoice attached.\n\n"
                    + "Regards,\n"
                    + "HMS Hospital"
            );

            helper.addAttachment(
                    "invoice.pdf",
                    () -> new java.io.ByteArrayInputStream(pdf)
            );

            mailSender.send(message);

            System.out.println(
                    "Invoice email sent"
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}