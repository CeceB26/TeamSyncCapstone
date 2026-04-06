package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.Commission;
import com.cece.teamsyncre.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findByUser(User user);
}