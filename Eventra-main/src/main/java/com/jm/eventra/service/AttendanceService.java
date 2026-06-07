package com.jm.eventra.service;

import com.jm.eventra.dto.response.AttendanceResponse;
import com.jm.eventra.dto.response.AttendanceSessionResponse;
import com.jm.eventra.entity.*;
import com.jm.eventra.repository.*;
import com.jm.eventra.entity.*;
import com.jm.eventra.exception.BusinessException;
import com.jm.eventra.mapper.AttendanceMapper;
import com.jm.eventra.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceSessionRepository attendanceSessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final AttendanceMapper attendanceMapper;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException("User not found", HttpStatus.NOT_FOUND));
    }

    public AttendanceSessionResponse openSession(Long eventId, int durationMinutes){
        User organizer = getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(()-> new BusinessException("Event not found", HttpStatus.NOT_FOUND));


        if (event.getStatus() != EventStatus.APPROVED){
            throw new BusinessException("Event is not active", HttpStatus.BAD_REQUEST);
        }

        AttendanceSession session = AttendanceSession.builder()
                .event(event)
                .createdBy(organizer)
                .token(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.MILLIS))
                .expiresAt(LocalDateTime.now().plusMinutes(durationMinutes).truncatedTo(ChronoUnit.MILLIS))
                .build();

        AttendanceSession saved = attendanceSessionRepository.save(session);
        return attendanceMapper.toSessionResponse(saved);
    }

    public AttendanceResponse markAttendance(String sessionToken, String qrCode){
        User student = getCurrentUser();

        AttendanceSession session = attendanceSessionRepository.findByToken(sessionToken)
                .orElseThrow(()-> new BusinessException("Invalid session token", HttpStatus.NOT_FOUND));

        if (LocalDateTime.now().isAfter(session.getExpiresAt())){
            throw new BusinessException("Attendance session has expired", HttpStatus.BAD_REQUEST);
        }

        Event event = session.getEvent();

        Registration registration = registrationRepository.findByQrContent(qrCode)
                .orElseThrow(() -> new BusinessException("Invalid QR code", HttpStatus.BAD_REQUEST));

        if (!registration.getEvent().getId().equals(event.getId())){
            throw new BusinessException("QR code does not belong to this event", HttpStatus.BAD_REQUEST);
        }

        User attendee = registration.getUser();

        if (attendanceRepository.existsByUserIdAndEventId(attendee.getId(), event.getId())){
            throw new BusinessException("Attendance already marked for this event", HttpStatus.CONFLICT);
        }

        Attendance attendance = Attendance.builder()
                .user(attendee)
                .event(event)
                .attendanceSession(session)
                .markedAt(LocalDateTime.now())
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        return attendanceMapper.toAttendanceResponse(saved);
    }

    public List<AttendanceResponse> getEventAttendance(Long eventId){
        return attendanceRepository.findByEventId(eventId)
                .stream()
                .map(attendanceMapper::toAttendanceResponse)
                .toList();
    }

    public List<AttendanceResponse> getMyAttendance(){
        User student = getCurrentUser();
        return attendanceRepository.findByUserId(student.getId())
                .stream()
                .map(attendanceMapper::toAttendanceResponse)
                .toList();
    }

    public List<AttendanceSessionResponse> getEventSession(Long eventId){
        return attendanceSessionRepository.findByEventId(eventId)
                .stream()
                .map(attendanceMapper::toSessionResponse)
                .toList();
    }


}
