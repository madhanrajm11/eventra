package com.jm.eventra.service;

import com.jm.eventra.dto.request.LoginRequest;
import com.jm.eventra.dto.request.RegisterRequest;
import com.jm.eventra.dto.response.AuthResponse;
import com.jm.eventra.entity.Role;
import com.jm.eventra.entity.User;
import com.jm.eventra.exception.BusinessException;
import com.jm.eventra.repository.UserRepository;
import com.jm.eventra.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BusinessException("Email is already registered", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .institutionName(req.institutionName())
                .department(req.department())
                .year(req.year())
                .designation(req.designation())
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest req) {

        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BusinessException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BusinessException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getName(),
                user.getDesignation() == null ? null : user.getDesignation().name(),
                user.getEmail(),
                user.getId()
        );
    }
}
