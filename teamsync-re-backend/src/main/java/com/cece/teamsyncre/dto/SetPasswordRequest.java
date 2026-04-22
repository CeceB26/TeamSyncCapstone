package com.cece.teamsyncre.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SetPasswordRequest {

    @NotBlank
    private String token;

    @NotBlank
    private String password;
}