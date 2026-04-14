package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.AnnouncementResponseDTO;
import com.cece.teamsyncre.dto.CreateAnnouncementRequest;
import com.cece.teamsyncre.dto.UserDTO;
import com.cece.teamsyncre.entity.Announcement;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.AnnouncementRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository, UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // CREATE
    public Announcement createAnnouncement(Announcement announcement, Long createdByUserId) {
        User createdBy = getUserOrThrow(createdByUserId);
        announcement.setCreatedBy(createdBy);
        return announcementRepository.save(announcement);
    }

    // GET ALL
    public List<AnnouncementResponseDTO> getAllAnnouncements() {
        return announcementRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // UPDATE (NEW)
    public AnnouncementResponseDTO updateAnnouncement(Long id, CreateAnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());

        if (request.getCreatedByUserId() != null) {
            User createdBy = getUserOrThrow(request.getCreatedByUserId());
            announcement.setCreatedBy(createdBy);
        }

        Announcement updated = announcementRepository.save(announcement);
        return mapToDTO(updated);
    }

    // DELETE
    public void deleteAnnouncement(Long announcementId) {
        announcementRepository.deleteById(announcementId);
    }

    // MAP TO DTO
    private AnnouncementResponseDTO mapToDTO(Announcement announcement) {
        return new AnnouncementResponseDTO(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCreatedAt(),
                new UserDTO(
                        announcement.getCreatedBy().getId(),
                        announcement.getCreatedBy().getFirstName(),
                        announcement.getCreatedBy().getLastName(),
                        announcement.getCreatedBy().getRole().name()
                )
        );
    }
}