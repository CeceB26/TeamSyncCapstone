package com.cece.teamsyncre.dto;

import com.cece.teamsyncre.entity.Announcement;
import com.cece.teamsyncre.entity.Commission;
import com.cece.teamsyncre.entity.Event;
import com.cece.teamsyncre.entity.Goal;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDashboardResponse {

    private List<Goal> goals;
    private List<Commission> commissions;
    private List<Announcement> announcements;
    private List<Event> events;
}