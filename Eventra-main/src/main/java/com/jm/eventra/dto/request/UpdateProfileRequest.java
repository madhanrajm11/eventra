package com.jm.eventra.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateProfileRequest(

        @NotBlank(message = "Name is required")
        String name,

        @Min(value = 1, message = "Year must be between 1 and 4")
        @Max(value = 4, message = "Year must be between 1 and 4")
        @NotNull(message = "Year is required")
        Integer year
) {
}
