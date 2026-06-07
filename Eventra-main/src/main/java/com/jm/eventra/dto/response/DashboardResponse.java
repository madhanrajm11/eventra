package com.jm.eventra.dto.response;

public record DashboardResponse(
        Long totalUser,
        Long totalEvents,
        Long totalRegistration,
        Long totalAttendance,
        Long pendingApprovals,
        Long approvedEvents,
        Long rejectedEvents
) {
}
