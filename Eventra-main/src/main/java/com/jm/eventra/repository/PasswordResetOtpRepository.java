package com.jm.eventra.repository;

import com.jm.eventra.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailOrderByCreatedAtDesc(String email);

    void deleteByExpiresAtBefore(LocalDateTime time);
}
