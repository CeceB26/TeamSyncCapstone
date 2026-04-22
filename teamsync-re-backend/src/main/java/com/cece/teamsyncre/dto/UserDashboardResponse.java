package com.cece.teamsyncre.dto;

import com.cece.teamsyncre.entity.Announcement;
import com.cece.teamsyncre.entity.Commission;
import com.cece.teamsyncre.entity.Event;
import com.cece.teamsyncre.entity.Goal;
import com.cece.teamsyncre.entity.Property;
import com.cece.teamsyncre.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDashboardResponse {

    private User user;
    private List<Goal> goals;
    private List<Commission> commissions;
    private List<Announcement> announcements;
    private List<Event> events;
    private List<Property> properties;
}