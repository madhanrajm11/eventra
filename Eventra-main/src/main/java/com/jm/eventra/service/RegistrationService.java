package com.jm.eventra.service;

import com.jm.eventra.dto.response.RegistrationResponse;
import com.jm.eventra.entity.Event;
import com.jm.eventra.entity.EventStatus;
import com.jm.eventra.entity.Registration;
import com.jm.eventra.entity.User;
import com.jm.eventra.exception.BusinessException;
import com.jm.eventra.mapper.RegistrationMapper;
import com.jm.eventra.repository.EventRepository;
import com.jm.eventra.repository.RegistrationRepository;
import com.jm.eventra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final QRCodeService qrCodeService;
    private final RegistrationMapper registrationMapper;
    private final EmailService emailService;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException("User not found", HttpStatus.NOT_FOUND));
    }

    public RegistrationResponse register(Long eventId){
        User student = getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(()-> new BusinessException("Event not found", HttpStatus.NOT_FOUND));

        if (event.getStatus() != EventStatus.APPROVED){
            throw new BusinessException("Event is not available for registration", HttpStatus.BAD_REQUEST);
        }

        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())){
            throw new BusinessException("Registration deadline has passed", HttpStatus.BAD_REQUEST);
        }

        int currentCount = registrationRepository.countByEventId(eventId);
        if (currentCount >= event.getCapacity()){
            throw new BusinessException("Event is full", HttpStatus.BAD_REQUEST);
        }

        if (registrationRepository.existsByUserIdAndEventId(student.getId(), eventId)){
            throw new BusinessException("You are already registered for this event", HttpStatus.CONFLICT);
        }

        String qrContent = "EVENTRA-" + UUID.randomUUID();
        String qrCodeBase64 = qrCodeService.generateQRCodeBase64(qrContent);

        Registration registration = Registration.builder()
                .user(student)
                .event(event)
                .qrCode(qrCodeBase64)
                .qrContent(qrContent)
                .registeredAt(LocalDateTime.now())
                .build();

        Registration saved = registrationRepository.save(registration);

        emailService.sendRegistrationConfirmation(
                student.getEmail(),
                student.getName(),
                event.getTitle(),
                event.getVenue(),
                event.getEventDate().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
        );

        return registrationMapper.toResponse(saved);
    }

    public List<RegistrationResponse> getMyRegistration(){
        User student = getCurrentUser();
        return registrationRepository.findByUserId(student.getId())
                .stream()
                .map(registrationMapper::toResponse)
                .toList();
    }

    public void cancelRegistration(Long registrationId){
        User student = getCurrentUser();
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(()-> new BusinessException("Registration not found",HttpStatus.NOT_FOUND));

        if (!registration.getUser().getId().equals(student.getId())){
            throw new BusinessException("you are not authorized to cancel this registration", HttpStatus.FORBIDDEN);
        }

        registrationRepository.delete(registration);
    }
}

