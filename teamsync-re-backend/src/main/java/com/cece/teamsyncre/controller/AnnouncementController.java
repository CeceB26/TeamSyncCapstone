package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.AnnouncementResponseDTO;
import com.cece.teamsyncre.dto.CreateAnnouncementRequest;
import com.cece.teamsyncre.entity.Announcement;
import com.cece.teamsyncre.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping
    public Announcement createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {

        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        return announcementService.createAnnouncement(
                announcement,
                request.getCreatedByUserId()
        );
    }

    @GetMapping
    public List<AnnouncementResponseDTO> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    @PutMapping("/{id}")
    public AnnouncementResponseDTO updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody CreateAnnouncementRequest request
    ) {
        return announcementService.updateAnnouncement(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
    }
}