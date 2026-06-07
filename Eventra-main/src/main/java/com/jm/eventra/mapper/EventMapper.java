package com.jm.eventra.mapper;

import com.jm.eventra.dto.response.EventResponse;
import com.jm.eventra.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {

    public EventResponse toResponse(Event event){
        int registeredCount = event.getRegistrations() == null ? 0 : event.getRegistrations() .size();
        Long organizerId = event.getOrganizer() != null ? event.getOrganizer().getId() : null;
        String organizerName = event.getOrganizer() != null ? event.getOrganizer().getName() : "Unknown";

        return new EventResponse(
                event.getId(),
                organizerId,
                event.getTitle(),
                event.getDescription(),
                event.getEventDate(),
                event.getVenue(),
                event.getCapacity(),
                registeredCount,
                event.getRegistrationDeadline(),
                event.getStatus(),
                event.getCreatedAt(),
                event.getIdCardUrl(),
                event.getPermissionLetterUrl(),
                event.getRejectionReason(),
                organizerName
        );
    }
}
