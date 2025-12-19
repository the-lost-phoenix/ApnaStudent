package com.apnastudent.backend.service;

import com.apnastudent.backend.model.User;
import com.apnastudent.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import com.apnastudent.backend.repository.ProjectRepository;

@Service // Tells Spring: "This class holds the business logic"
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email}")
    private String adminEmail;

    // Logic: Register a new student
    public User registerUser(User user) {
        // ... (existing logic)
        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }
        // Check if username already exists
        if (user.getUsername() != null && userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already taken!");
        }

        // Clerk handles verification, so we trust this registration coming from the
        // frontend
        user.setVerified(true);
        user.setOtp(null);

        // SAVE THE USER
        
        // PROFESSIONAL AUTH: Check against configured Admin Email
        if (user.getEmail().equalsIgnoreCase(adminEmail)) {
             user.setRole("ADMIN");
        } else {
             // Default role
             if (user.getRole() == null) user.setRole("STUDENT");
        }

        return userRepository.save(user);
    }
    
    // Logic: Update user details
    public User updateUser(String id, User updatedStats) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        // Update fields if they are not null
        if(updatedStats.getName() != null) existingUser.setName(updatedStats.getName());
        if(updatedStats.getBio() != null) existingUser.setBio(updatedStats.getBio());
        if(updatedStats.getUsn() != null) existingUser.setUsn(updatedStats.getUsn());
        // Add other fields as necessary
        
        return userRepository.save(existingUser);
    }

    // Logic: Find a user by their email (for Login)
    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user;
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Logic: Get ALL students (For the Admin Dashboard)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }

    // Logic: Delete user (Cascade deletes projects via DB/JPA)
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Logic: Get Platform Stats
    public Map<String, Long> getAppStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("users", userRepository.count());
        stats.put("projects", projectRepository.count());
        return stats;
    }

}