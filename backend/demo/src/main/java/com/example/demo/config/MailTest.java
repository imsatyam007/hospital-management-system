package com.example.demo.config;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Component;

@Component
public class MailTest {

    @Autowired
    private JavaMailSender
            mailSender;

    @PostConstruct
    public void testMail() {

        try {

            SimpleMailMessage message =
                    new SimpleMailMessage();

            message.setTo(
                    "suryansh.singh.5806@gmail.com"
            );

            message.setSubject(
                    "HMS Mail Test"
            );

            message.setText(
                    "Spring Mail is working successfully!"
            );

            mailSender.send(
                    message
            );

            System.out.println(
                    "EMAIL SENT SUCCESSFULLY"
            );

        } catch (Exception e) {

            System.out.println(
                    "EMAIL FAILED"
            );

            e.printStackTrace();
        }
    }
}