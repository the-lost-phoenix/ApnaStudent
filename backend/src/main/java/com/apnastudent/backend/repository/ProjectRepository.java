package com.apnastudent.backend.repository;

import com.apnastudent.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {

    // Custom Query: Find all projects belonging to a specific student
    List<Project> findByUserId(String userId);
}