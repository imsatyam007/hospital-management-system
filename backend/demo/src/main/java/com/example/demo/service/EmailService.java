package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendAppointmentEmail(
            String adminEmail,
            String toEmail,
            String patientName,
            String doctorName,
            LocalDate appointmentDate
    ) {
        try {
            String formattedDate = appointmentDate
                    .format(DateTimeFormatter
                        .ofPattern("dd MMMM yyyy"));

            SimpleMailMessage message =
                new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setCc(adminEmail);
            message.setSubject(
                "✅ Appointment Confirmed — HMS"
            );
            message.setText(
                "Hello " + patientName + ",\n\n"
                + "Your appointment has been "
                + "successfully confirmed.\n\n"
                + "Doctor  : " + doctorName + "\n"
                + "Date    : " + formattedDate + "\n\n"
                + "Please arrive 10 minutes before "
                + "your scheduled time.\n\n"
                + "Thank you,\n"
                + "HMS Team"
            );

            mailSender.send(message);

            System.out.println(
                "✅ Email sent to: " + toEmail
            );
            System.out.println(
                "✅ CC sent to admin: " + adminEmail
            );

        } catch (Exception e) {
            // ✅ Improved error logging
            System.err.println("❌ EMAIL FAILED");
            e.printStackTrace();
        }
    }
}