package com.jm.eventra.controller;

import com.jm.eventra.dto.request.RejectEventRequest;
import com.jm.eventra.dto.response.EventResponse;
import com.jm.eventra.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/events")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventController {

    private final EventService eventService;

    @GetMapping("/pending")
    public ResponseEntity<List<EventResponse>> getPendingEvents(){
        return ResponseEntity.ok(eventService.getPendingEvents());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<EventResponse> approveEvent(@PathVariable Long id){
        return ResponseEntity.ok(eventService.approveEvent(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<EventResponse> rejectEvent(
            @PathVariable Long id,
            @RequestBody RejectEventRequest request){
        return ResponseEntity.ok(eventService.rejectEvent(id, request.reason()));
    }
}
