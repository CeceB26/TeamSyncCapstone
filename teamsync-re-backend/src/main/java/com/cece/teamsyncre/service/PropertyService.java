package com.cece.teamsyncre.service;

import com.cece.teamsyncre.dto.CreatePropertyRequest;
import com.cece.teamsyncre.dto.PropertyResponseDTO;
import com.cece.teamsyncre.dto.UserDTO;
import com.cece.teamsyncre.entity.Property;
import com.cece.teamsyncre.entity.User;
import com.cece.teamsyncre.repository.PropertyRepository;
import com.cece.teamsyncre.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyService(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public Property createProperty(Property property, Long userId) {
        User user = getUserOrThrow(userId);
        property.setUser(user);
        property.setCreatedAt(LocalDateTime.now());
        return propertyRepository.save(property);
    }

    public List<PropertyResponseDTO> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public PropertyResponseDTO updateProperty(Long id, CreatePropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));

        property.setRepresentation(request.getRepresentation());
        property.setListingDate(request.getListingDate());
        property.setClosingDate(request.getClosingDate());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setMls(request.getMls());
        property.setListPrice(request.getListPrice());
        property.setSalePrice(request.getSalePrice());
        property.setStatus(request.getStatus());
        property.setClientName(request.getClientName());

        if (request.getUserId() != null) {
            User user = getUserOrThrow(request.getUserId());
            property.setUser(user);
        }

        Property updatedProperty = propertyRepository.save(property);
        return mapToDTO(updatedProperty);
    }

    public void deleteProperty(Long propertyId) {
        propertyRepository.deleteById(propertyId);
    }

    private PropertyResponseDTO mapToDTO(Property property) {
        return new PropertyResponseDTO(
                property.getId(),
                property.getRepresentation(),
                property.getListingDate(),
                property.getClosingDate(),
                property.getAddress(),
                property.getCity(),
                property.getState(),
                property.getZipCode(),
                property.getMls(),
                property.getListPrice(),
                property.getSalePrice(),
                property.getStatus(),
                property.getClientName(),
                property.getCreatedAt(),
                new UserDTO(
                        property.getUser().getId(),
                        property.getUser().getFirstName(),
                        property.getUser().getLastName(),
                        property.getUser().getRole().name()
                )
        );
    }
}