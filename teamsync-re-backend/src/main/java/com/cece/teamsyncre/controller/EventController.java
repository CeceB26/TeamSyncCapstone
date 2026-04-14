package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreateEventRequest;
import com.cece.teamsyncre.dto.EventResponseDTO;
import com.cece.teamsyncre.entity.Event;
import com.cece.teamsyncre.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public Event createEvent(@Valid @RequestBody CreateEventRequest request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .build();

        return eventService.createEvent(event, request.getCreatedByUserId());
    }

    @GetMapping
    public List<EventResponseDTO> getAllEvents() {
        return eventService.getAllEvents();
    }

    @PutMapping("/{id}")
    public EventResponseDTO updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody CreateEventRequest request
    ) {
        return eventService.updateEvent(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}