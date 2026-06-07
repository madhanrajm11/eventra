package com.jm.eventra.repository;

import com.jm.eventra.entity.Event;
import com.jm.eventra.entity.Registration;
import com.jm.eventra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    boolean existsByUserAndEvent (User user, Event event);

    boolean existsByUserIdAndEventId (Long userId, Long eventId);

    int countByEventId(Long eventId);

    List<Registration> findByUserId(Long userId);

    List<Registration> findByEventId(Long id);

    Optional<Registration> findByQrContent(String qrContent);
   
    Optional<Registration> findByQrCode(String qrCode);

    @Query("""
            select r from Registration r
            join fetch r.user
            where r.event.id = :eventId
            """)
    List<Registration> findByEventIdWithUser(@Param("eventId") Long eventId);
}
