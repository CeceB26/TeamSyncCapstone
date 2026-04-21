package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.MlsShortcut;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MlsShortcutRepository extends JpaRepository<MlsShortcut, Long> {
    List<MlsShortcut> findBySubmittedByUserIdOrderByCreatedAtDesc(Long userId);
}