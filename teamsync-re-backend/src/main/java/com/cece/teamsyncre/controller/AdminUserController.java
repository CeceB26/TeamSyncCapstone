package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateUserRequest;
import com.cece.teamsyncre.service.AdminUserService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @PostMapping
    public String createUser(@RequestBody CreateUserRequest request) {
        adminUserService.createUser(request);
        return "User created and invite sent.";
    }
}