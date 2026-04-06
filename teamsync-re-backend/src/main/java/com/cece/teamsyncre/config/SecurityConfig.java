package com.cece.teamsyncre.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/api/dashboard", "/api/dashboard/**").permitAll()
                        .requestMatchers("/api/users", "/api/users/**").permitAll()
                        .requestMatchers("/api/announcements", "/api/announcements/**").permitAll()
                        .requestMatchers("/api/goals", "/api/goals/**").permitAll()
                        .requestMatchers("/api/events", "/api/events/**").permitAll()
                        .requestMatchers("/api/commissions", "/api/commissions/**").permitAll()
                        .requestMatchers("/api/properties", "/api/properties/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}