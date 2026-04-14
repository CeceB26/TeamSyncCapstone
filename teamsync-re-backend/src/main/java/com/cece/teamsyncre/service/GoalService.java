package com.cece.teamsyncre.service;

import com.cece.teamsyncre.entity.Goal;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.GoalRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(GoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    // 🔁 Reusable method to fetch user
    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ Create Goal
    public Goal createGoal(Goal goal, Long userId) {
        User user = getUserOrThrow(userId);
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    // ✅ Get Goals by User
    public List<Goal> getGoalsByUser(Long userId) {
        User user = getUserOrThrow(userId);
        return goalRepository.findByUser(user);
    }

    // ✅ Delete Goal
    public void deleteGoal(Long goalId) {
        goalRepository.deleteById(goalId);
    }
}