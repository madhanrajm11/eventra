package com.jm.eventra.repository;

import com.jm.eventra.entity.ApprovalLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApprovalLogRepository extends JpaRepository<ApprovalLog, Long> {

    Optional<ApprovalLog> findByEventId(Long eventId);
}
