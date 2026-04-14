package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CommissionResponseDTO;
import com.cece.teamsyncre.dto.CreateCommissionRequest;
import com.cece.teamsyncre.entity.Commission;
import com.cece.teamsyncre.service.CommissionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/commissions")
public class CommissionController {

    private final CommissionService commissionService;

    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    @PostMapping
    public Commission createCommission(@Valid @RequestBody CreateCommissionRequest request) {
        Commission commission = Commission.builder()
                .amount(request.getAmount())
                .transactionName(request.getTransactionName())
                .closingDate(request.getClosingDate())
                .build();

        return commissionService.createCommission(commission, request.getUserId());
    }

    @GetMapping
    public List<CommissionResponseDTO> getAllCommissions() {
        return commissionService.getAllCommissions();
    }

    @PutMapping("/{id}")
    public CommissionResponseDTO updateCommission(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommissionRequest request
    ) {
        return commissionService.updateCommission(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCommission(@PathVariable Long id) {
        commissionService.deleteCommission(id);
    }
}