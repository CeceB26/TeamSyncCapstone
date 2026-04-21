package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateAiDraftRequest;
import com.cece.teamsyncre.entity.AiDraft;
import com.cece.teamsyncre.repository.AiDraftRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AiDraftService {

    private final AiDraftRepository aiDraftRepository;

    public AiDraftService(AiDraftRepository aiDraftRepository) {
        this.aiDraftRepository = aiDraftRepository;
    }

    public AiDraft create(CreateAiDraftRequest request) {
        AiDraft aiDraft = AiDraft.builder()
                .taskType(request.getTaskType())
                .audience(request.getAudience())
                .tone(request.getTone())
                .propertyAddress(request.getPropertyAddress())
                .cityState(request.getCityState())
                .pricePoint(request.getPricePoint())
                .bedsBaths(request.getBedsBaths())
                .propertyType(request.getPropertyType())
                .transactionStage(request.getTransactionStage())
                .callToAction(request.getCallToAction())
                .context(request.getContext())
                .outputText(request.getOutputText())
                .submittedByUserId(request.getSubmittedByUserId())
                .createdAt(LocalDateTime.now())
                .build();

        AiDraft saved = aiDraftRepository.save(aiDraft);

        trimToFiveForUser(request.getSubmittedByUserId());

        return saved;
    }

    private void trimToFiveForUser(Long userId) {
        List<AiDraft> drafts =
                aiDraftRepository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);

        if (drafts.size() > 5) {
            List<AiDraft> toDelete = drafts.subList(5, drafts.size());
            aiDraftRepository.deleteAll(toDelete);
        }
    }

    public List<AiDraft> getByUserId(Long userId) {
        return aiDraftRepository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<AiDraft> getAll() {
        return aiDraftRepository.findAll();
    }
}