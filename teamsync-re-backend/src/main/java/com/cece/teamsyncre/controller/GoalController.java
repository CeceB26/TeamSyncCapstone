package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateGoalRequest;
import com.cece.teamsyncre.entity.Goal;
import com.cece.teamsyncre.repository.GoalRepository;
import com.cece.teamsyncre.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;
    private final GoalRepository goalRepository;

    public GoalController(GoalService goalService, GoalRepository goalRepository) {
        this.goalService = goalService;
        this.goalRepository = goalRepository;
    }

    @PostMapping
    public Goal createGoal(@Valid @RequestBody CreateGoalRequest request) {
        Goal goal = Goal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetValue(request.getTargetValue())
                .currentValue(request.getCurrentValue())
                .dueDate(request.getDueDate())
                .status(request.getStatus())
                .build();

        return goalService.createGoal(goal, request.getUserId());
    }


    @GetMapping
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Goal> getGoalsByUser(@PathVariable Long userId) {
        return goalService.getGoalsByUser(userId);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
}