package com.jm.eventra.dto.response;

import java.time.LocalDateTime;

public record RegistrationResponse(
        Long id,
        String eventTitle,
        String eventVenue,
        LocalDateTime eventDate,
        String attendanceName,
        String qrCode,
        String qrContent,
        LocalDateTime registeredAt
) {
}
