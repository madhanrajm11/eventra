package com.jm.eventra.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "approval_log")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewBy;

    private String rejectionReason;

    private String adminComment;

    private LocalDateTime reviewedAt;
}
