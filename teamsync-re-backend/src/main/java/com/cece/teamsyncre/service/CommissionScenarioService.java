package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreateCommissionScenarioRequest;
import com.cece.teamsyncre.entity.CommissionScenario;
import com.cece.teamsyncre.repository.CommissionScenarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommissionScenarioService {

    private final CommissionScenarioRepository repository;

    public CommissionScenarioService(CommissionScenarioRepository repository) {
        this.repository = repository;
    }

    public CommissionScenario create(CreateCommissionScenarioRequest request) {
        CommissionScenario scenario = CommissionScenario.builder()
                .salePrice(request.getSalePrice())
                .commissionPercent(request.getCommissionPercent())
                .brokerSplitPercent(request.getBrokerSplitPercent())
                .referralPercent(request.getReferralPercent())
                .transactionFee(request.getTransactionFee())
                .grossCommission(request.getGrossCommission())
                .referralAmount(request.getReferralAmount())
                .afterReferral(request.getAfterReferral())
                .brokerSplitAmount(request.getBrokerSplitAmount())
                .estimatedNet(request.getEstimatedNet())
                .submittedByUserId(request.getSubmittedByUserId())
                .createdAt(LocalDateTime.now())
                .build();

        CommissionScenario saved = repository.save(scenario);

        trimToFiveForUser(request.getSubmittedByUserId());

        return saved;
    }

    public CommissionScenario update(Long id, CreateCommissionScenarioRequest request) {
        CommissionScenario scenario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission scenario not found"));

        scenario.setSalePrice(request.getSalePrice());
        scenario.setCommissionPercent(request.getCommissionPercent());
        scenario.setBrokerSplitPercent(request.getBrokerSplitPercent());
        scenario.setReferralPercent(request.getReferralPercent());
        scenario.setTransactionFee(request.getTransactionFee());
        scenario.setGrossCommission(request.getGrossCommission());
        scenario.setReferralAmount(request.getReferralAmount());
        scenario.setAfterReferral(request.getAfterReferral());
        scenario.setBrokerSplitAmount(request.getBrokerSplitAmount());
        scenario.setEstimatedNet(request.getEstimatedNet());

        return repository.save(scenario);
    }

    private void trimToFiveForUser(Long userId) {
        List<CommissionScenario> scenarios =
                repository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);

        if (scenarios.size() > 5) {
            List<CommissionScenario> toDelete = scenarios.subList(5, scenarios.size());
            repository.deleteAll(toDelete);
        }
    }

    public List<CommissionScenario> getByUser(Long userId) {
        return repository.findBySubmittedByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<CommissionScenario> getAll() {
        return repository.findAll();
    }
}