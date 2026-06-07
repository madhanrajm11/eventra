package com.jm.eventra.repository;

import com.jm.eventra.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    List<Attendance> findByEventId(Long eventId);

    List<Attendance> findByUserId(Long userId);

}
