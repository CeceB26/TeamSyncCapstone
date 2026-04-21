package com.cece.teamsyncre.dto;

import lombok.Data;

@Data
public class CreatePresentationRequest {
    private String presentationType;
    private String clientName;
    private String propertyAddress;
    private String notes;
    private Long submittedByUserId;
}