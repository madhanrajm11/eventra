package com.jm.eventra.repository;

import com.jm.eventra.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {

    Optional<AttendanceSession> findByToken(String token);

    List<AttendanceSession> findByEventId(Long eventId);
}
