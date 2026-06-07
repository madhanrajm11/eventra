package com.jm.eventra.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String FROM_EMAIL = "evnetra.io@gmail.com";

    private final JavaMailSender mailSender;

    public void sendRegistrationConfirmation(String toEmail, String studentName,
                                             String eventTitle, String eventVenue,
                                             String eventDate){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(FROM_EMAIL);
        message.setSubject("Registration Confirmed - " + eventTitle);
        message.setText(
                "Hi " + studentName + ",\n\n" +
                        "Your registration for " + eventTitle + " has been confirmed!\n\n" +
                        "Event Details:\n" +
                        "Title: " + eventTitle + "\n" +
                        "Venue: " + eventVenue + "\n" +
                        "Date: " + eventDate + "\n\n" +
                        "Please keep your QR code ready for attendance.\n\n" +
                        "regards,\n" +
                        "Eventra Team"
        );
        safeSend(message, "registration confirmation", toEmail);
    }

    public void sendEventUpdateNotification(String toEmail, String studentName,
                                            String eventTitle,
                                            String oldVenue, String newVenue,
                                            String oldEventDate, String newEventDate){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(FROM_EMAIL);
        message.setSubject("Event Updated - " + eventTitle);
        message.setText(
                "Hi " + studentName + ",\n\n" +
                        "An event you registered for has been updated.\n\n" +
                        "Event: " + eventTitle + "\n\n" +
                        "Updated Details:\n" +
                        "Venue: " + oldVenue + " → " + newVenue + "\n" +
                        "Date: " + oldEventDate + " → " + newEventDate + "\n\n" +
                        "Please check the app for the latest details.\n\n" +
                        "regards,\n" +
                        "Eventra Team"
        );
        safeSend(message, "event update notification", toEmail);
    }

    public void sendPasswordResetOtp(String toEmail, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(FROM_EMAIL);
        message.setSubject("Eventra Password Reset OTP");
        message.setText(
                "Hi,\n\n" +
                        "Your OTP to reset your Eventra password is:\n\n" +
                        otp + "\n\n" +
                        "This OTP will expire in 3 minutes.\n\n" +
                        "If you didn't request this, ignore this email.\n\n" +
                        "regards,\n" +
                        "Eventra Team"
        );
        safeSend(message, "password reset OTP", toEmail);
    }

    public void sendPasswordResetSuccess(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom(FROM_EMAIL);
        message.setSubject("Eventra Password Changed Successfully");
        message.setText(
                "Hi,\n\n" +
                        "Your Eventra account password was changed successfully.\n\n" +
                        "If you did not perform this action, please reset your password immediately and contact support.\n\n" +
                        "Regards,\n" +
                        "Eventra Team"
        );
        safeSend(message, "password reset success", toEmail);
    }

    private void safeSend(SimpleMailMessage message, String context, String to) {
        try {
            logger.info("Sending {} email to {}", context, to);
            mailSender.send(message);
            logger.info("{} email sent successfully to {}", context, to);
        } catch (Exception e) {
            logger.error("Failed to send {} email to {}: {}", context, to, e.getMessage(), e);
        }
    }
}