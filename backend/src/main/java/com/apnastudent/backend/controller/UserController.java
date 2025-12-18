package com.apnastudent.backend.controller;

import com.apnastudent.backend.model.User;
import com.apnastudent.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Logic: "I am ready to listen to web requests"
@RequestMapping("/api/users") // Logic: "I handle all addresses starting with /api/users"
@CrossOrigin(origins = "*") // Logic: "I allow React (or anyone) to call me"
public class UserController {

    @Autowired
    private UserService userService;

    // ---------------- ADMIN FEATURES ----------------
    // 5. Get App Stats
    // URL: GET http://localhost:8080/api/users/stats
    // MOVED TO TOP to prevent conflict with @GetMapping("/{id}")
    @GetMapping("/stats")
    public java.util.Map<String, Long> getStats() {
        return userService.getAppStats();
    }

    // 1. Register a new user
    // URL: POST http://localhost:8080/api/users/register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // 2. Get All Users (For Admin Dashboard)
    // URL: GET http://localhost:8080/api/users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 3. Find User by Email (For Login or Search)
    // URL: GET http://localhost:8080/api/users/find?email=aditya@example.com
    @GetMapping("/find")
    public User getUserByEmail(@RequestParam String email) {
        return userService.findUserByEmail(email);
    }

    // 4. Search Users by Name (For Admin Dashboard)
    // URL: GET http://localhost:8080/api/users/search?name=aditya
    @GetMapping("/search")
    public List<User> searchUsersByName(@RequestParam String name) {
        return userService.searchUsersByName(name);
    }

    // URL: GET http://localhost:8080/api/users/{id}
    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getAllUsers().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 8. Update User Details
    // URL: PUT http://localhost:8080/api/users/{id}
    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // URL: GET http://localhost:8080/api/users/u/{username}
    @GetMapping("/u/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userService.findUserByUsername(username);
    }

    // ---------------- ADMIN FEATURES ----------------
    // (getStats moved to top)

    // 6. Delete User
    // URL: DELETE http://localhost:8080/api/users/{id}
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }

    // 7. Admin Add User (Manual)
    // URL: POST http://localhost:8080/api/users/add
    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
}