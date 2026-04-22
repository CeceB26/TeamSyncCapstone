package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateUserRequest;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.enums.RoleType;
import com.cece.teamsyncre.enums.UserStatus;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest request) {
        RoleType role = request.getRole() != null ? request.getRole() : RoleType.USER;

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password("")
                .role(role)
                .status(UserStatus.PENDING)
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}