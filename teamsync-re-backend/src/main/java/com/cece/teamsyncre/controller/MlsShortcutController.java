package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateMlsShortcutRequest;
import com.cece.teamsyncre.entity.MlsShortcut;
import com.cece.teamsyncre.service.MlsShortcutService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mls-shortcuts")
public class MlsShortcutController {

    private final MlsShortcutService service;

    public MlsShortcutController(MlsShortcutService service) {
        this.service = service;
    }

    @PostMapping
    public MlsShortcut create(@RequestBody CreateMlsShortcutRequest request) {
        return service.create(request);
    }

    @GetMapping("/user/{userId}")
    public List<MlsShortcut> getByUser(@PathVariable Long userId) {
        return service.getByUser(userId);
    }

    @GetMapping
    public List<MlsShortcut> getAll() {
        return service.getAll();
    }
}