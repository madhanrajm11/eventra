package com.jm.eventra.service;

import com.jm.eventra.dto.request.ResetPasswordWithOtpRequest;
import com.jm.eventra.entity.PasswordResetOtp;
import com.jm.eventra.entity.User;
import com.jm.eventra.exception.BusinessException;
import com.jm.eventra.repository.PasswordResetOtpRepository;
import com.jm.eventra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PasswordResetService {

    private static final int OTP_EXP_MINUTES = 3;
    private static final int OTP_MAX_ATTEMPTS = 6;
    private static final int RESEND_COOLDOWN_SECONDS = 60;

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private String generateOtp(){
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }

    public void requestOtp(String email){

        passwordResetOtpRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        var lastOtp = passwordResetOtpRepository.findTopByEmailOrderByCreatedAtDesc(email);
        if (lastOtp.isPresent()){
            LocalDateTime lastSent = lastOtp.get().getCreatedAt();
            if (lastSent != null && lastSent.isAfter(LocalDateTime.now().minusSeconds(RESEND_COOLDOWN_SECONDS))){
                return;
            }
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return;

        String otp = generateOtp();

        PasswordResetOtp record = PasswordResetOtp.builder()
                .email(email)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXP_MINUTES))
                .attempts(0)
                .used(false)
                .createdAt(LocalDateTime.now())
                .build();

        passwordResetOtpRepository.save(record);
        emailService.sendPasswordResetOtp(email, otp);
    }

    public void resetPassword(ResetPasswordWithOtpRequest request){
        if (!request.newPassword().equals(request.confirmPassword())){
            throw new BusinessException("New password and confirm password does not match", HttpStatus.BAD_REQUEST);
        }

        PasswordResetOtp otp = passwordResetOtpRepository.findTopByEmailOrderByCreatedAtDesc(request.email())
                .orElseThrow(() -> new BusinessException("Invalid OTP", HttpStatus.BAD_REQUEST));

        if (otp.isUsed() || otp.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new BusinessException("OTP expired or already used", HttpStatus.BAD_REQUEST);
        }

        if (otp.getAttempts() >= OTP_MAX_ATTEMPTS){
            throw new BusinessException("Too many attempts. Request a new OTP", HttpStatus.TOO_MANY_REQUESTS);
        }

        otp.setAttempts(otp.getAttempts() + 1);

        boolean ok = passwordEncoder.matches(request.otp(), otp.getOtpHash());
        passwordResetOtpRepository.save(otp);

        if (!ok){
            throw new BusinessException("Invalid OTP", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Invalid OTP", HttpStatus.BAD_REQUEST));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        otp.setUsed(true);
        passwordResetOtpRepository.save(otp);

        emailService.sendPasswordResetSuccess(user.getEmail());
    }
}
