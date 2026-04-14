package com.cece.teamsyncre.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class CommissionResponseDTO {

    private Long id;
    private Double amount;
    private String transactionName;
    private LocalDate closingDate;
    private UserDTO user;
}