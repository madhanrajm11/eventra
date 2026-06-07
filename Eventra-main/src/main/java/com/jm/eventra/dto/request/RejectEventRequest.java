package com.jm.eventra.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RejectEventRequest(

        @NotBlank(message = "Rejection reason is required")
        String reason
) {
}
