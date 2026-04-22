package com.cece.teamsyncre.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/admin/users",
                                "/api/dashboard/**",
                                "/api/users/**",
                                "/api/goals/**",
                                "/api/events/**",
                                "/api/properties/**",
                                "/api/commissions/**",
                                "/api/announcements/**",
                                "/api/messages/**",
                                "/api/edit-requests/**",
                                "/api/commission-scenarios/**",
                                "/api/presentation-requests/**",
                                "/api/ai-drafts/**"
                        ).permitAll()
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}