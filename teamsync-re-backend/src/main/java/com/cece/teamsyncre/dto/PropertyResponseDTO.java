package com.cece.teamsyncre.dto;

import com.cece.teamsyncre.enums.PropertyStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PropertyResponseDTO {

    private Long id;
    private String representation;
    private String listingDate;
    private String closingDate;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String mls;
    private Double listPrice;
    private Double salePrice;
    private PropertyStatus status;
    private String clientName;
    private LocalDateTime createdAt;
    private UserDTO user;
}