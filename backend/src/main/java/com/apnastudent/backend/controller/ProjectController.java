package com.apnastudent.backend.controller;

import com.apnastudent.backend.model.Project;
import com.apnastudent.backend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // 1. Add a new Project
    // URL: POST http://localhost:8080/api/projects/add
    @PostMapping("/add")
    public Project addProject(@RequestBody Project project) {
        return projectService.addProject(project);
    }

    // 2. Get All Projects (For Explorer Page)
    // URL: GET http://localhost:8080/api/projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    // 3. Get Projects by User ID (For a specific Student's Portfolio)
    // URL: GET http://localhost:8080/api/projects/user/1
    @GetMapping("/user/{userId}")
    public List<Project> getProjectsByUser(@PathVariable Long userId) {
        System.out.println("Fetching projects for User ID: " + userId);
        List<Project> projects = projectService.getProjectsByUserId(userId);
        System.out.println("Found " + projects.size() + " projects.");
        return projects;
    }

    // 4. Delete Project
    // URL: DELETE http://localhost:8080/api/projects/{id}
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}