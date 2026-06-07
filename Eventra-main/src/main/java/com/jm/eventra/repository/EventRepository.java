package com.jm.eventra.repository;

import com.jm.eventra.entity.Event;
import com.jm.eventra.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Long countByStatus(EventStatus status);

    List<Event> findByStatus (EventStatus status);

    List<Event> findByOrganizerId (Long organizerId);
}
