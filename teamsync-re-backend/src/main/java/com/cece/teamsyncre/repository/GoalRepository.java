package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.Goal;
import com.cece.teamsyncre.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUser(User user);
}