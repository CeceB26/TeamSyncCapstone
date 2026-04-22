package com.cece.teamsyncre.dto;

import com.cece.teamsyncre.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private RoleType role;
    private String message;
}