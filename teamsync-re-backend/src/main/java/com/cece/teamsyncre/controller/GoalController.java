package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateGoalRequest;
import com.cece.teamsyncre.entity.Goal;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.GoalRepository;
import com.cece.teamsyncre.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalController(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Goal createGoal(@Valid @RequestBody CreateGoalRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Goal goal = Goal.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .targetValue(request.getTargetValue())
                .currentValue(request.getCurrentValue())
                .dueDate(request.getDueDate())
                .status(request.getStatus())
                .user(user)
                .build();

        return goalRepository.save(goal);
    }

    @GetMapping
    public List<Goal> getAllGoals() {
        return goalRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalRepository.deleteById(id);
    }
}