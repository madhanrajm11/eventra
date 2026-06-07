package com.jm.eventra.controller;

import com.jm.eventra.dto.response.FileUploadResponse;
import com.jm.eventra.service.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {
        String filePath = fileStorageService.store(file);
        String baseUrl = request.getRequestURL()
                .toString()
                .replace(request.getRequestURI(), request.getContextPath());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new FileUploadResponse(baseUrl + filePath));
    }
}
