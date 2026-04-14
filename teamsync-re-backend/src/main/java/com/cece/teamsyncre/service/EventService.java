package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateEventRequest;
import com.cece.teamsyncre.dto.EventResponseDTO;
import com.cece.teamsyncre.dto.UserDTO;
import com.cece.teamsyncre.entity.Event;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.EventRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public Event createEvent(Event event, Long createdByUserId) {
        User createdBy = getUserOrThrow(createdByUserId);
        event.setCreatedBy(createdBy);
        return eventRepository.save(event);
    }

    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public EventResponseDTO updateEvent(Long id, CreateEventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());

        if (request.getCreatedByUserId() != null) {
            User createdBy = getUserOrThrow(request.getCreatedByUserId());
            event.setCreatedBy(createdBy);
        }

        Event updatedEvent = eventRepository.save(event);
        return mapToDTO(updatedEvent);
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    private EventResponseDTO mapToDTO(Event event) {
        return new EventResponseDTO(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate(),
                event.getLocation(),
                new UserDTO(
                        event.getCreatedBy().getId(),
                        event.getCreatedBy().getFirstName(),
                        event.getCreatedBy().getLastName(),
                        event.getCreatedBy().getRole().name()
                )
        );
    }
}