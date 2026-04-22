package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreatePresentationRequest;
import com.cece.teamsyncre.entity.PresentationRequest;
import com.cece.teamsyncre.service.PresentationRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/presentation-requests")
public class PresentationRequestController {

    private final PresentationRequestService presentationRequestService;

    public PresentationRequestController(PresentationRequestService presentationRequestService) {
        this.presentationRequestService = presentationRequestService;
    }

    @PostMapping
    public PresentationRequest create(@RequestBody CreatePresentationRequest request) {
        return presentationRequestService.create(request);
    }

    @GetMapping("/user/{userId}")
    public List<PresentationRequest> getByUser(@PathVariable Long userId) {
        return presentationRequestService.getByUserId(userId);
    }

    @GetMapping
    public List<PresentationRequest> getAll() {
        return presentationRequestService.getAll();
    }
}