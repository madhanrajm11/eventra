package com.jm.eventra.dto.response;

public record AuthResponse(
        String token,
        String role,
        String name,
        String designation,
        String email,
        Long userId
) {
}
