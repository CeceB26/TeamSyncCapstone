package com.cece.teamsyncre.entity;

import com.cece.teamsyncre.enums.PropertyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String representation;

    private String listingDate;

    private String closingDate;

    private String address;

    private String city;

    private String state;

    private String zipCode;

    private String mls;

    @Column(nullable = false)
    private Double listPrice;

    private Double salePrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status;

    private String clientName;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}