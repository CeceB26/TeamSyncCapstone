package com.cece.teamsyncre.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateCommissionRequest {

    @NotNull
    private Double amount;

    @NotBlank
    private String transactionName;

    private LocalDate closingDate;

    @NotNull
    private Long userId;
}