package com.cece.teamsyncre.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalGoals;
    private long totalAnnouncements;
    private long totalEvents;
    private long totalCommissions;
}