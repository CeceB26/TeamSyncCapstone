package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateUserRequest;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @Valid @RequestBody CreateUserRequest request) {
        return userService.updateUser(id, request);
    }

    @PutMapping("/{id}/deactivate")
    public User deactivateUser(@PathVariable Long id) {
        return userService.deactivateUser(id);
    }

    @PutMapping("/{id}/reactivate")
    public User reactivateUser(@PathVariable Long id) {
        return userService.reactivateUser(id);
    }
}