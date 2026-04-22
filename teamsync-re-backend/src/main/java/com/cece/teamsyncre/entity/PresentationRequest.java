package com.cece.teamsyncre.entity;

import jakarta.persistence.*;
        import lombok.*;

        import java.time.LocalDateTime;

@Entity
@Table(name = "presentation_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String presentationType;

    private String clientName;

    private String propertyAddress;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Long submittedByUserId;

    private LocalDateTime createdAt;
}