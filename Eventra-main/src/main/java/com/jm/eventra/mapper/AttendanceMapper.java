package com.jm.eventra.mapper;

import com.jm.eventra.dto.response.AttendanceResponse;
import com.jm.eventra.dto.response.AttendanceSessionResponse;
import com.jm.eventra.entity.Attendance;
import com.jm.eventra.entity.AttendanceSession;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AttendanceMapper {

    public AttendanceSessionResponse toSessionResponse(AttendanceSession session){
        boolean isActive = session.getExpiresAt().isAfter(LocalDateTime.now());
        return new AttendanceSessionResponse(
                session.getId(),
                session.getEvent().getTitle(),
                session.getToken(),
                session.getExpiresAt(),
                session.getCreatedAt(),
                isActive
        );
    }

    public AttendanceResponse toAttendanceResponse(Attendance attendance){
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getEvent().getTitle(),
                attendance.getUser().getName(),
                attendance.getUser().getEmail(),
                attendance.getAttendanceSession().getToken(),
                attendance.getMarkedAt()
        );
    }
}
