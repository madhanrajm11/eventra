package com.jm.eventra.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record EventRequest(

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Event date is required")
        @Future(message = "Event date must be in the future")
        LocalDateTime eventDate,

        @NotBlank(message = "Venue is required")
        String venue,

        @NotNull(message = "Capacity is required")
        @Positive(message = "Capacity must be greater than 0")
        Integer capacity,

        @NotNull(message = "Registration deadline is required")
        @Future(message = "Registration deadline must be in the future")
        LocalDateTime registrationDeadline,

        String idCardUrl,

        String permissionLetterUrl,

        Boolean notifyRegistrants
) {
}
