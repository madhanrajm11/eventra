package com.jm.eventra.dto.response;

public record UserProfileResponse(
        String name,
        String email,
        String institutionName,
        String department,
        Integer year
) {
}
