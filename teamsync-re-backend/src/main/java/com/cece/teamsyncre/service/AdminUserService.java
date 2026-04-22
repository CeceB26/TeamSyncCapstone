package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateUserRequest;
import com.cece.teamsyncre.entity.ConfirmationToken;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.enums.UserStatus;
import com.cece.teamsyncre.repository.ConfirmationTokenRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final EmailService emailService;

    public AdminUserService(UserRepository userRepository,
                            ConfirmationTokenRepository confirmationTokenRepository,
                            EmailService emailService) {
        this.userRepository = userRepository;
        this.confirmationTokenRepository = confirmationTokenRepository;
        this.emailService = emailService;
    }

    public void createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("A user with this email already exists.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password("")
                .role(request.getRole())
                .status(UserStatus.PENDING)
                .enabled(false)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        ConfirmationToken token = ConfirmationToken.create(savedUser.getId());
        confirmationTokenRepository.save(token);

        String inviteLink = "http://localhost:5173/confirm?token=" + token.getToken();

        emailService.sendInviteEmail(savedUser.getEmail(), inviteLink);
    }
}