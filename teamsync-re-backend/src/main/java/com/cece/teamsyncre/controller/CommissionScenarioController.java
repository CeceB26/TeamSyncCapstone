package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateCommissionScenarioRequest;
import com.cece.teamsyncre.entity.CommissionScenario;
import com.cece.teamsyncre.service.CommissionScenarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/commission-scenarios")
public class CommissionScenarioController {

    private final CommissionScenarioService service;

    public CommissionScenarioController(CommissionScenarioService service) {
        this.service = service;
    }

    @PostMapping
    public CommissionScenario create(@RequestBody CreateCommissionScenarioRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public CommissionScenario update(
            @PathVariable Long id,
            @RequestBody CreateCommissionScenarioRequest request
    ) {
        return service.update(id, request);
    }

    @GetMapping("/user/{userId}")
    public List<CommissionScenario> getByUser(@PathVariable Long userId) {
        return service.getByUser(userId);
    }

    @GetMapping
    public List<CommissionScenario> getAll() {
        return service.getAll();
    }
}