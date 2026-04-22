package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.PresentationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PresentationRequestRepository extends JpaRepository<PresentationRequest, Long> {
    List<PresentationRequest> findBySubmittedByUserIdOrderByCreatedAtDesc(Long submittedByUserId);
}