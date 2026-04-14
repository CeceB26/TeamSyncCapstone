package com.cece.teamsyncre.controller;

import com.cece.teamsyncre.dto.CreatePropertyRequest;
import com.cece.teamsyncre.dto.PropertyResponseDTO;
import com.cece.teamsyncre.entity.Property;
import com.cece.teamsyncre.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public Property createProperty(@Valid @RequestBody CreatePropertyRequest request) {
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
                .build();

        return propertyService.createProperty(property, request.getUserId());
    }

    @GetMapping
    public List<PropertyResponseDTO> getAllProperties() {
        return propertyService.getAllProperties();
    }

    @PutMapping("/{id}")
    public PropertyResponseDTO updateProperty(
            @PathVariable Long id,
            @Valid @RequestBody CreatePropertyRequest request
    ) {
        return propertyService.updateProperty(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProperty(@PathVariable Long id) {
        propertyService.deleteProperty(id);
    }
}