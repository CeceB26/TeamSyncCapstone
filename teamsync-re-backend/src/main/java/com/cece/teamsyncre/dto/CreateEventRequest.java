package com.cece.teamsyncre.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateEventRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDateTime eventDate;

    private String location;

    @NotNull
    private Long createdByUserId;
}