package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CommissionResponseDTO;
import com.cece.teamsyncre.dto.CreateCommissionRequest;
import com.cece.teamsyncre.dto.UserDTO;
import com.cece.teamsyncre.entity.Commission;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.CommissionRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;

    public CommissionService(CommissionRepository commissionRepository, UserRepository userRepository) {
        this.commissionRepository = commissionRepository;
        this.userRepository = userRepository;
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public Commission createCommission(Commission commission, Long userId) {
        User user = getUserOrThrow(userId);
        commission.setUser(user);
        return commissionRepository.save(commission);
    }

    public List<CommissionResponseDTO> getAllCommissions() {
        return commissionRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public CommissionResponseDTO updateCommission(Long id, CreateCommissionRequest request) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found with id: " + id));

        commission.setAmount(request.getAmount());
        commission.setTransactionName(request.getTransactionName());
        commission.setClosingDate(request.getClosingDate());

        if (request.getUserId() != null) {
            User user = getUserOrThrow(request.getUserId());
            commission.setUser(user);
        }

        Commission updatedCommission = commissionRepository.save(commission);
        return mapToDTO(updatedCommission);
    }

    public void deleteCommission(Long id) {
        commissionRepository.deleteById(id);
    }

    private CommissionResponseDTO mapToDTO(Commission commission) {
        return new CommissionResponseDTO(
                commission.getId(),
                commission.getAmount(),
                commission.getTransactionName(),
                commission.getClosingDate(),
                new UserDTO(
                        commission.getUser().getId(),
                        commission.getUser().getFirstName(),
                        commission.getUser().getLastName(),
                        commission.getUser().getRole().name()
                )
        );
    }
}