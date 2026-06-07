package com.jm.eventra.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDateTime eventDate;

    private String venue;

    private Integer capacity;

    private LocalDateTime registrationDeadline;

    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String idCardUrl;

    @Column(columnDefinition = "TEXT")
    private String permissionLetterUrl;

    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Registration> registrations;
}
