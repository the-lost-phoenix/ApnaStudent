package com.apnastudent.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = true) // Nullable for existing users, but frontend should enforce it
    private String username;

    private String password;

    private String usn; // University Seat Number

    private String role; // We will store "STUDENT" or "ADMIN" here

    @Column(length = 500) // Allow up to 500 characters
    private String bio;

    // Email Verification Fields
    private String otp;
    private boolean verified = false;
}