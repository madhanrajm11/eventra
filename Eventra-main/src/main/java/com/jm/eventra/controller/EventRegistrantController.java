package com.jm.eventra.controller;

import com.jm.eventra.dto.response.RegistrantResponse;
import com.jm.eventra.service.EventRegistrantService;
import com.jm.eventra.service.RegistrantExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventRegistrantController {

    private final EventRegistrantService eventRegistrantService;
    private final RegistrantExportService registrantExportService;

    @GetMapping("/{eventId}/registrants")
    public ResponseEntity<List<RegistrantResponse>> getRegistrants(@PathVariable Long eventId){
        return ResponseEntity.ok(eventRegistrantService.getRegistrantsForEvent(eventId));
    }

    @GetMapping("/{eventId}/registrants/export/csv")
    public ResponseEntity<byte[]> exportCsv(@PathVariable Long eventId){
        List<RegistrantResponse> registrants = eventRegistrantService.getRegistrantsForEvent(eventId);
        byte[] bytes = registrantExportService.toCsvBytes(registrants);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"event-" + eventId + "registrants.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(bytes);
    }

    @GetMapping("/{eventId}/registrants/export/xlsx")
    public ResponseEntity<byte[]> exportXlsx(@PathVariable Long eventId){
        List<RegistrantResponse> registrants = eventRegistrantService.getRegistrantsForEvent(eventId);
        byte[] bytes = registrantExportService.toXlsBytes(registrants);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"event" + eventId + "-registrants.xlsx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocuments.spreadsheetml.sheet"))
                .body(bytes);
    }
}
