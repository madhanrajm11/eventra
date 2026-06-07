package com.jm.eventra.dto.response;

import java.time.LocalDateTime;

public record AttendanceResponse(
        Long id,
        String eventTitle,
        String attendeeName,
        String attendeeEmail,
        String sessionToken,
        LocalDateTime markedAt
) {
}
