package com.apnastudent.backend.repository;

import com.apnastudent.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

// JpaRepository<Entity, ID_Type>
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom Query: Find a user by their email (for login)
    // Spring Boot writes the SQL for this automatically just by reading the method
    // name!
    Optional<User> findByEmail(String email);

    // Check if a user exists by email (for registration)
    boolean existsByEmail(String email);

    // Check if username exists
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    // Find users where the name contains the search text (IgnoreCase means "aditya"
    // matches "Aditya")
    List<User> findByNameContainingIgnoreCase(String name);
}