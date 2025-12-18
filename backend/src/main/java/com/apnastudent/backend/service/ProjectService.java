package com.apnastudent.backend.service;

import com.apnastudent.backend.model.Project;
import com.apnastudent.backend.model.User;
import com.apnastudent.backend.repository.ProjectRepository;
import com.apnastudent.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository; // Added this!

    // Logic: Add a project to the database
    public Project addProject(Project project) {
        // FIX: The project comes with a "fake" user (only ID).
        // We must fetch the REAL user from the DB and attach it.
        if (project.getUser() != null && project.getUser().getId() != null) {
            User realUser = userRepository.findById(project.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            project.setUser(realUser);
        }
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Logic: Delete a project
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}