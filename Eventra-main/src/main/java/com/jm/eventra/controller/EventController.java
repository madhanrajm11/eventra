package com.jm.eventra.controller;

import com.jm.eventra.dto.request.EventRequest;
import com.jm.eventra.dto.response.EventResponse;
import com.jm.eventra.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvent(){
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id){
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<EventResponse>> getMyEvents(){
        return ResponseEntity.ok(eventService.getMyEvents());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long id, @Valid @RequestBody EventRequest request){
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<String> cancelEvent(@PathVariable Long id){
        eventService.cancelEvent(id);
        return ResponseEntity.ok("Event cancelled successfully");
    }
}
