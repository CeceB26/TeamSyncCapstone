package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.AiDraft;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiDraftRepository extends JpaRepository<AiDraft, Long> {
    List<AiDraft> findBySubmittedByUserIdOrderByCreatedAtDesc(Long submittedByUserId);
}