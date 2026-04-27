package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateAiDraftRequest;
import com.cece.teamsyncre.entity.AiDraft;
import com.cece.teamsyncre.repository.AiDraftRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AiDraftService {

    private final AiDraftRepository aiDraftRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4.1-mini}")
    private String openAiModel;

    public AiDraftService(AiDraftRepository aiDraftRepository) {
        this.aiDraftRepository = aiDraftRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AiDraft create(CreateAiDraftRequest request) {

        String prompt = buildPrompt(request);

        String aiGeneratedText = callOpenAi(prompt);

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
                .outputText(aiGeneratedText)
                .submittedByUserId(request.getSubmittedByUserId())
                .createdAt(LocalDateTime.now())
                .build();

        AiDraft saved = aiDraftRepository.save(aiDraft);

        trimToFiveForUser(request.getSubmittedByUserId());

        return saved;
    }

    private String buildPrompt(CreateAiDraftRequest request) {
        return """
                You are an AI assistant for real estate professionals.

                Create a polished real estate draft using the details below.

                Task Type:
                %s

                Audience:
                %s

                Tone:
                %s

                Property Address:
                %s

                City/State:
                %s

                Price Point:
                %s

                Beds/Baths:
                %s

                Property Type:
                %s

                Transaction Stage:
                %s

                Call To Action:
                %s

                Additional Context:
                %s

                Requirements:
                - Make the response clear, professional, and useful for a Realtor.
                - Keep the content focused on small teams, boutique brokerages, or individual agents when relevant.
                - Avoid unsupported claims.
                - Include a strong call to action.
                - Format the response so it can be copied directly into an email, text, social media post, or client message.
                """.formatted(
                safe(request.getTaskType()),
                safe(request.getAudience()),
                safe(request.getTone()),
                safe(request.getPropertyAddress()),
                safe(request.getCityState()),
                safe(request.getPricePoint()),
                safe(request.getBedsBaths()),
                safe(request.getPropertyType()),
                safe(request.getTransactionStage()),
                safe(request.getCallToAction()),
                safe(request.getContext())
        );
    }

    private String callOpenAi(String prompt) {
        String url = "https://api.openai.com/v1/responses";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        Map<String, Object> requestBody = Map.of(
                "model", openAiModel,
                "input", prompt
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());

            JsonNode outputText = root.path("output_text");

            if (!outputText.isMissingNode() && !outputText.asText().isBlank()) {
                return outputText.asText();
            }

            return "AI response was received, but no readable output text was returned.";

        } catch (Exception e) {
            return "AI draft could not be generated at this time. Please try again later. Error: "
                    + e.getMessage();
        }
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

    private String safe(Object value) {
        if (value == null) {
            return "Not provided";
        }
        return value.toString().trim().isEmpty() ? "Not provided" : value.toString();
    }
}