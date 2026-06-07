package com.jm.eventra.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AttendanceMarkRequest(
        @NotBlank(message = "Session token is required")
        String sessionToken,

        @NotBlank(message = "QR code is required")
        String qrCode
) {
}
