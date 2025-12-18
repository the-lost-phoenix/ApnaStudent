package com.apnastudent.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@apnastudent.com"); // This will be overridden by SMTP username usually
            message.setTo(to);
            message.setSubject("Verify your ApnaStudent Account");
            message.setText("Welcome to ApnaStudent!\n\n" +
                    "Your verification code is: " + otp + "\n\n" +
                    "Please enter this code to complete your registration.\n" +
                    "If you did not request this, please ignore this email.");

            mailSender.send(message);
            System.out.println("OTP Email sent to " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
