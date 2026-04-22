package com.cece.teamsyncre.dto;

import lombok.Data;

@Data
public class CreateCommissionScenarioRequest {
    private Double salePrice;
    private Double commissionPercent;
    private Double brokerSplitPercent;
    private Double referralPercent;
    private Double transactionFee;
    private Double grossCommission;
    private Double referralAmount;
    private Double afterReferral;
    private Double brokerSplitAmount;
    private Double estimatedNet;
    private Long submittedByUserId;
}