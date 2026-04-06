package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateCommissionRequest;
import com.cece.teamsyncre.entity.Commission;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.CommissionRepository;
import com.cece.teamsyncre.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/commissions")
public class CommissionController {

    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;

    public CommissionController(CommissionRepository commissionRepository, UserRepository userRepository) {
        this.commissionRepository = commissionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Commission createCommission(@Valid @RequestBody CreateCommissionRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Commission commission = Commission.builder()
                .amount(request.getAmount())
                .transactionName(request.getTransactionName())
                .closingDate(request.getClosingDate())
                .user(user)
                .build();

        return commissionRepository.save(commission);
    }

    @GetMapping
    public List<Commission> getAllCommissions() {
        return commissionRepository.findAll();
    }
}