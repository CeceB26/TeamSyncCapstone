package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreatePropertyRequest;
import com.cece.teamsyncre.entity.Property;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.PropertyRepository;
import com.cece.teamsyncre.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyController(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Property createProperty(@Valid @RequestBody CreatePropertyRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Property property = Property.builder()
                .representation(request.getRepresentation())
                .listingDate(request.getListingDate())
                .closingDate(request.getClosingDate())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .mls(request.getMls())
                .listPrice(request.getListPrice())
                .salePrice(request.getSalePrice())
                .status(request.getStatus())
                .clientName(request.getClientName())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        return propertyRepository.save(property);
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable Long id) {
        propertyRepository.deleteById(id);
    }
}