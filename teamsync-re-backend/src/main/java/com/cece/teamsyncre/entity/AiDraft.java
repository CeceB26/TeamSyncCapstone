package com.cece.teamsyncre.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_drafts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiDraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(columnDefinition = "TEXT")
    private String context;

    @Column(columnDefinition = "TEXT")
    private String outputText;

    private Long submittedByUserId;

    private LocalDateTime createdAt;
}