package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateAnnouncementRequest;
import com.cece.teamsyncre.entity.Announcement;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.AnnouncementRepository;
import com.cece.teamsyncre.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository, UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Announcement createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        User createdBy = userRepository.findById(request.getCreatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getCreatedByUserId()));

        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .createdBy(createdBy)
                .build();

        return announcementRepository.save(announcement);
    }

    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }
}