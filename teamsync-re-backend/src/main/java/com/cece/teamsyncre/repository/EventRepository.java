package com.cece.teamsyncre.repository;

import com.cece.teamsyncre.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}