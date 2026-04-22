package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateMlsShortcutRequest;
import com.cece.teamsyncre.entity.MlsShortcut;
import com.cece.teamsyncre.repository.MlsShortcutRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MlsShortcutService {

    private final MlsShortcutRepository repository;

    public MlsShortcutService(MlsShortcutRepository repository) {
        this.repository = repository;
    }

    public MlsShortcut create(CreateMlsShortcutRequest request) {
        MlsShortcut shortcut = MlsShortcut.builder()
                .label(request.getLabel())
                .url(request.getUrl())
                .submittedByUserId(request.getSubmittedByUserId())
                .createdAt(LocalDateTime.now())
                .build();

        return repository.save(shortcut);
    }

    public List<MlsShortcut> getByUser(Long userId) {
        return repository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<MlsShortcut> getAll() {
        return repository.findAll();
    }
}