package com.cece.teamsyncre.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AnnouncementResponseDTO {

    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private UserDTO createdBy;
}