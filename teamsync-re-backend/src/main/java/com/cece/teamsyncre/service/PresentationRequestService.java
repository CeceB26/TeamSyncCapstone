package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreatePresentationRequest;
import com.cece.teamsyncre.entity.PresentationRequest;
import com.cece.teamsyncre.repository.PresentationRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PresentationRequestService {

    private final PresentationRequestRepository repository;

    public PresentationRequestService(PresentationRequestRepository repository) {
        this.repository = repository;
    }

    public PresentationRequest create(CreatePresentationRequest request) {
        PresentationRequest presentationRequest = PresentationRequest.builder()
                .presentationType(request.getPresentationType())
                .clientName(request.getClientName())
                .propertyAddress(request.getPropertyAddress())
                .notes(request.getNotes())
                .submittedByUserId(request.getSubmittedByUserId())
                .createdAt(LocalDateTime.now())
                .build();

        PresentationRequest saved = repository.save(presentationRequest);

        trimToFiveForUser(request.getSubmittedByUserId());

        return saved;
    }

    private void trimToFiveForUser(Long userId) {
        List<PresentationRequest> requests =
                repository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);

        if (requests.size() > 5) {
            List<PresentationRequest> toDelete = requests.subList(5, requests.size());
            repository.deleteAll(toDelete);
        }
    }

    public List<PresentationRequest> getByUserId(Long userId) {
        return repository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<PresentationRequest> getAll() {
        return repository.findAll();
    }
}