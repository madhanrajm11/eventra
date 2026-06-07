package com.jm.eventra.service;

import com.jm.eventra.dto.response.DashboardResponse;
import com.jm.eventra.entity.EventStatus;
import com.jm.eventra.entity.User;
import com.jm.eventra.exception.BusinessException;
import com.jm.eventra.repository.AttendanceRepository;
import com.jm.eventra.repository.EventRepository;
import com.jm.eventra.repository.RegistrationRepository;
import com.jm.eventra.repository.UserRepository;
import com.jm.eventra.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DashboardService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final AttendanceRepository attendanceRepository;

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new BusinessException("User not found", HttpStatus.NOT_FOUND));
    }

    public DashboardResponse getDashboard(){
        return new DashboardResponse(
                userRepository.count(),
                eventRepository.count(),
                registrationRepository.count(),
                attendanceRepository.count(),
                eventRepository.countByStatus (EventStatus.PENDING_APPROVAL),
                eventRepository.countByStatus (EventStatus.APPROVED),
                eventRepository.countByStatus(EventStatus.REJECTED)
        );
    }


}
