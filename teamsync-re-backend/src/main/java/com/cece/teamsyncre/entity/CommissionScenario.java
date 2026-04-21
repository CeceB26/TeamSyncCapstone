package com.cece.teamsyncre.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "commission_scenarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommissionScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    private LocalDateTime createdAt;
}