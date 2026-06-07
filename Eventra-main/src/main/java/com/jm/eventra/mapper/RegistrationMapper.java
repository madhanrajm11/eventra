package com.jm.eventra.mapper;

import com.jm.eventra.dto.response.RegistrationResponse;
import com.jm.eventra.entity.Registration;
import org.springframework.stereotype.Component;

@Component
public class RegistrationMapper {

    public RegistrationResponse toResponse(Registration registration){
        return new RegistrationResponse(
                registration.getId(),
                registration.getEvent().getTitle(),
                registration.getEvent().getVenue(),
                registration.getEvent().getEventDate(),
                registration.getUser().getName(),
                registration.getQrCode(),
                registration.getQrContent(),
                registration.getRegisteredAt()
        );
    }
}
