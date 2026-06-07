package com.jm.eventra.dto.response;

import com.jm.eventra.entity.EventStatus;

import java.time.LocalDateTime;

public record EventResponse(

        Long id,
        Long organizerId,
        String title,
        String description,
        LocalDateTime eventDate,
        String venue,
        Integer capacity,
        Integer registeredCount,
        LocalDateTime registrationDeadline,
        EventStatus status,
        LocalDateTime createdAt,
        String idCardUrl,
        String permissionLetterUrl,
        String rejectionReason,
        String organizerName

) {
}
