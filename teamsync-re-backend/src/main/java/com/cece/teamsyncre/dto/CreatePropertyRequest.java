package com.cece.teamsyncre.dto;

import com.cece.teamsyncre.enums.PropertyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePropertyRequest {

    @NotBlank
    private String representation;

    private String listingDate;

    private String closingDate;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String mls;

    @NotNull
    private Double listPrice;

    private Double salePrice;

    @NotNull
    private PropertyStatus status;

    private String clientName;

    @NotNull
    private Long userId;
}