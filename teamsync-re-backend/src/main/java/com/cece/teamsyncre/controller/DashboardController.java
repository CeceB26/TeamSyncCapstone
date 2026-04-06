package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.AdminDashboardResponse;
import com.cece.teamsyncre.dto.UserDashboardResponse;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.AnnouncementRepository;
import com.cece.teamsyncre.repository.CommissionRepository;
import com.cece.teamsyncre.repository.EventRepository;
import com.cece.teamsyncre.repository.GoalRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final GoalRepository goalRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final CommissionRepository commissionRepository;

    public DashboardController(UserRepository userRepository,
                               GoalRepository goalRepository,
                               AnnouncementRepository announcementRepository,
                               EventRepository eventRepository,
                               CommissionRepository commissionRepository) {
        this.userRepository = userRepository;
        this.goalRepository = goalRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.commissionRepository = commissionRepository;
    }

    @GetMapping("/admin-summary")
    public AdminDashboardResponse getAdminSummary() {
        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalGoals(goalRepository.count())
                .totalAnnouncements(announcementRepository.count())
                .totalEvents(eventRepository.count())
                .totalCommissions(commissionRepository.count())
                .build();
    }

    @GetMapping("/user/{userId}")
    public UserDashboardResponse getUserDashboard(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserDashboardResponse.builder()
                .goals(goalRepository.findByUser(user))
                .commissions(commissionRepository.findByUser(user))
                .announcements(announcementRepository.findAll())
                .events(eventRepository.findAll())
                .build();
    }
}