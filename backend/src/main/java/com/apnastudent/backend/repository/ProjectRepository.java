package com.apnastudent.backend.repository;

import com.apnastudent.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Custom Query: Find all projects belonging to a specific student
    // Custom Query: Find all projects belonging to a specific student
    List<Project> findByUser_Id(Long userId);
}