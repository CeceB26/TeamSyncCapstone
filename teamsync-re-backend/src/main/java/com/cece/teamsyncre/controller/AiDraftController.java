package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateAiDraftRequest;
import com.cece.teamsyncre.entity.AiDraft;
import com.cece.teamsyncre.service.AiDraftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/ai-drafts")
public class AiDraftController {

    private final AiDraftService aiDraftService;

    public AiDraftController(AiDraftService aiDraftService) {
        this.aiDraftService = aiDraftService;
    }

    @PostMapping
    public ResponseEntity<AiDraft> create(@RequestBody CreateAiDraftRequest request) {
        AiDraft savedDraft = aiDraftService.create(request);
        return ResponseEntity.ok(savedDraft);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AiDraft>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(aiDraftService.getByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<AiDraft>> getAll() {
        return ResponseEntity.ok(aiDraftService.getAll());
    }
}