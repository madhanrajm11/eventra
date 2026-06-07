package com.jm.eventra.dto.request;

import com.jm.eventra.entity.Designation;
import jakarta.validation.constraints.*;

public record RegisterRequest(

        @NotBlank(message = "Name is required")
        String name,
        

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password,

        @NotBlank(message = "Institution name is required")
        String institutionName,

        @NotBlank(message = "Department is required")
        String department,

        @Min(value = 1, message = "Year must be between 1 and 4")
        @Max(value = 4, message = "Year must be between 1 and 4")
        Integer year,

        @NotNull(message = "Designation is required")
        Designation designation
) {
}
