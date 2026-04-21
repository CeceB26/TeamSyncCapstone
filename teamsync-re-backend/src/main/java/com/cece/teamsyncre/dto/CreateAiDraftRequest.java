package com.cece.teamsyncre.dto;

import lombok.Data;

@Data
public class CreateAiDraftRequest {
    private String taskType;
    private String audience;
    private String tone;
    private String propertyAddress;
    private String cityState;
    private String pricePoint;
    private String bedsBaths;
    private String propertyType;
    private String transactionStage;
    private String callToAction;
    private String context;
    private String outputText;
    private Long submittedByUserId;
}