package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateAiDraftRequest;
import com.cece.teamsyncre.entity.AiDraft;
import com.cece.teamsyncre.service.AiDraftService;
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
    public AiDraft create(@RequestBody CreateAiDraftRequest request) {
        return aiDraftService.create(request);
    }

    @GetMapping("/user/{userId}")
    public List<AiDraft> getByUser(@PathVariable Long userId) {
        return aiDraftService.getByUserId(userId);
    }

    @GetMapping
    public List<AiDraft> getAll() {
        return aiDraftService.getAll();
    }
}