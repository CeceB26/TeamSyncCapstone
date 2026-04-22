package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.CommissionScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionScenarioRepository extends JpaRepository<CommissionScenario, Long> {
    List<CommissionScenario> findBySubmittedByUserIdOrderByCreatedAtDesc(Long userId);
}