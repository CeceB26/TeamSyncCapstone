package com.cece.teamsyncre.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendInviteEmail(String toEmail, String link) {
        System.out.println("Sending invite email to: " + toEmail);
        System.out.println("Invite link: " + link);
    }
}