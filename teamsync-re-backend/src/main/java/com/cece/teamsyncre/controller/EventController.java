package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateEventRequest;
import com.cece.teamsyncre.entity.Event;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.EventRepository;
import com.cece.teamsyncre.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventController(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Event createEvent(@Valid @RequestBody CreateEventRequest request) {
        User createdBy = userRepository.findById(request.getCreatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getCreatedByUserId()));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .createdBy(createdBy)
                .build();

        return eventRepository.save(event);
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}