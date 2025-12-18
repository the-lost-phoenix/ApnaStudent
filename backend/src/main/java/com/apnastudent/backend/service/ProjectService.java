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
        // In NoSQL mode, the project already has "userId" populated via the unpackUser method.
        // We can verify if the user exists if we want to be strict.
        if (project.getUserId() != null) {
            if (!userRepository.existsById(project.getUserId())) {
                throw new RuntimeException("User not found: " + project.getUserId());
            }
        }
        return projectRepository.save(project);
    }

    public List<Project> getProjectsByUserId(String userId) {
        return projectRepository.findByUserId(userId);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Logic: Delete a project
    public void deleteProject(String id) {
        projectRepository.deleteById(id);
    }
    
    // Logic: Update Project
    public Project updateProject(String id, Project updatedProject) {
        Project existingProject = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
            
        if(updatedProject.getTitle() != null) existingProject.setTitle(updatedProject.getTitle());
        if(updatedProject.getDescription() != null) existingProject.setDescription(updatedProject.getDescription());
        if(updatedProject.getGithubUrl() != null) existingProject.setGithubUrl(updatedProject.getGithubUrl());
        if(updatedProject.getDemoUrl() != null) existingProject.setDemoUrl(updatedProject.getDemoUrl());
        if(updatedProject.getReadmeContent() != null) existingProject.setReadmeContent(updatedProject.getReadmeContent());
        
        return projectRepository.save(existingProject);
    }
}