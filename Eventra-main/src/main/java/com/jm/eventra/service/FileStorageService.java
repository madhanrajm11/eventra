package com.jm.eventra.service;

import com.jm.eventra.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "application/pdf");
    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "application/pdf", ".pdf"
    );

    private final Path uploadRoot;

    public FileStorageService(@Value("${eventra.upload-dir:uploads}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Please choose a file to upload", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("File size must be under 5MB", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new BusinessException("Only JPG, PNG or PDF files are allowed", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.createDirectories(uploadRoot);

            String extension = EXTENSIONS.get(contentType);
            String filename = UUID.randomUUID() + extension;
            Path destination = uploadRoot.resolve(filename).normalize();
            if (!destination.startsWith(uploadRoot)) {
                throw new BusinessException("Invalid file name", HttpStatus.BAD_REQUEST);
            }

            file.transferTo(destination);
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new BusinessException("File upload failed. Please try again", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }
}
