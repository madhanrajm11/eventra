package com.jm.eventra.controller;

import com.jm.eventra.dto.request.AttendanceMarkRequest;
import com.jm.eventra.dto.response.AttendanceResponse;
import com.jm.eventra.dto.response.AttendanceSessionResponse;
import com.jm.eventra.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/sessions/events/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AttendanceSessionResponse> openSession(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "30") int durationMinutes){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.openSession(eventId, durationMinutes));
    }

    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @Valid @RequestBody AttendanceMarkRequest request){
        return ResponseEntity.ok(attendanceService.markAttendance(request.sessionToken(), request.qrCode()));
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AttendanceResponse>> getEventAttendance(@PathVariable Long eventId){
        return ResponseEntity.ok(attendanceService.getEventAttendance(eventId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AttendanceResponse>> getMyAttendance(){
        return ResponseEntity.ok(attendanceService.getMyAttendance());
    }

    @GetMapping("/sessions/events/{eventId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AttendanceSessionResponse>> getEventSession(@PathVariable Long eventId){
        return ResponseEntity.ok(attendanceService.getEventSession(eventId));
    }
}
