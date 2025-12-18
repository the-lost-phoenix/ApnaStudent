package com.apnastudent.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    private String name;

    // We enforce uniqueness at the Application/Service level or use @Indexed(unique=true)
    private String email;

    private String username;

    private String password;

    private String usn; // University Seat Number

    private String role; // We will store "STUDENT" or "ADMIN" here

    private String bio;

    // Email Verification Fields
    private String otp;
    private boolean verified = false;
}