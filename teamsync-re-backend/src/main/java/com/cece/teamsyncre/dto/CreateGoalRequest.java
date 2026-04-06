package com.cece.teamsyncre.dto;

import com.cece.teamsyncre.enums.GoalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateGoalRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private Double targetValue;

    @NotNull
    private Double currentValue;

    private LocalDate dueDate;

    @NotNull
    private GoalStatus status;

    @NotNull
    private Long userId;
}