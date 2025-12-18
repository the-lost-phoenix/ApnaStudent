package com.apnastudent.backend.service;

import com.apnastudent.backend.model.User;
import com.apnastudent.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
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

    // Logic: Register a new student
    public User registerUser(User user) {
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

        // Save the user to the database
        return userRepository.save(user);
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
    public void deleteUser(Long id) {
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