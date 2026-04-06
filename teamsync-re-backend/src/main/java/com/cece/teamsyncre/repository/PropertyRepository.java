package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.Property;
import com.cece.teamsyncre.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByUser(User user);
}