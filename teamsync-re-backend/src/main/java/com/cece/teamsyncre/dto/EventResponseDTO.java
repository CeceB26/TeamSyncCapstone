package com.cece.teamsyncre.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class EventResponseDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private UserDTO createdBy;
}