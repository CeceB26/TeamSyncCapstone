package com.cece.teamsyncre.enums;

public enum UserStatus {
    PENDING,     // invited but not confirmed
    ACTIVE,      // confirmed and usable
    SUSPENDED,   // temporarily blocked
    DELETED      // soft delete / disabled permanently
}