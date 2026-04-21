package com.cece.teamsyncre.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mls_shortcuts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MlsShortcut {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String label;
    private String url;
    private Long submittedByUserId;
    private LocalDateTime createdAt;
}