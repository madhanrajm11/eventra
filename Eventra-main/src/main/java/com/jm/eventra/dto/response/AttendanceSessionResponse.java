package com.jm.eventra.dto.response;

import java.time.LocalDateTime;

public record AttendanceSessionResponse(
        Long id,
        String eventTitle,
        String sessionToken,
        LocalDateTime expiresAt,
        LocalDateTime createdAt,
        boolean isActive
) {
}
