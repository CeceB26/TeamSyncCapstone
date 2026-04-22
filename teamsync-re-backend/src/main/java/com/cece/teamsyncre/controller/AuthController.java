package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.SetPasswordRequest;
import com.cece.teamsyncre.entity.ConfirmationToken;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.enums.UserStatus;
import com.cece.teamsyncre.repository.ConfirmationTokenRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.cece.teamsyncre.dto.LoginRequest;
import com.cece.teamsyncre.dto.LoginResponse;
import com.cece.teamsyncre.enums.UserStatus;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final ConfirmationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            ConfirmationTokenRepository tokenRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/confirm")
    public String confirm(@RequestParam String token) {

        ConfirmationToken confirmationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (confirmationToken.getConfirmedAt() != null) {
            return "Already confirmed";
        }

        if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        confirmationToken.setConfirmedAt(LocalDateTime.now());
        tokenRepository.save(confirmationToken);

        User user = userRepository.findById(confirmationToken.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(true);
        userRepository.save(user);

        return "Email confirmed. Now set your password.";
    }

    @PostMapping("/set-password")
    public String setPassword(@RequestBody SetPasswordRequest request) {

        ConfirmationToken confirmationToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (confirmationToken.getConfirmedAt() == null) {
            throw new RuntimeException("Email not confirmed yet");
        }

        if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = userRepository.findById(confirmationToken.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            throw new RuntimeException("Password has already been set for this account");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        tokenRepository.delete(confirmationToken);

        return "Password set successfully. You can now log in.";
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isEnabled() || user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new LoginResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }
}