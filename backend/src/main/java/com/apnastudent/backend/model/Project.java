package com.apnastudent.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "projects")
@Data
public class Project {

    @Id
    private String id;

    private String title;

    private String description;

    private String githubUrl;

    private String demoUrl;

    private String readmeContent;

    // RELATIONSHIP MAPPING
    // In NoSQL, we usually store the reference ID directly.
    private String userId;

    // COMPATIBILITY: Frontend sends "user": { "id": "..." }
    // This setter unpacks it so we don't break the API.
    @com.fasterxml.jackson.annotation.JsonProperty("user")
    private void unpackUser(java.util.Map<String, Object> user) {
        if (user != null && user.get("id") != null) {
            this.userId = String.valueOf(user.get("id"));
        }
    }
    
    // Optional: We can store a minimal User object if we want to avoid extra queries,
    // but for now, just the ID is enough.
}