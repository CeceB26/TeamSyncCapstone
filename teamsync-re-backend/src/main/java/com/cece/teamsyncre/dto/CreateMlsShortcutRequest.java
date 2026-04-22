package com.cece.teamsyncre.dto;

import lombok.Data;

@Data
public class CreateMlsShortcutRequest {
    private String label;
    private String url;
    private Long submittedByUserId;
}