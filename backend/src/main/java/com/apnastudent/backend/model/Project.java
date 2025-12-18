package com.apnastudent.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

// import com.fasterxml.jackson.annotation.JsonIgnore; // Removed

@Entity
@Data
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String githubUrl;

    private String demoUrl;

    // @Lob tells MySQL this is a Large Object (Long text)
    // "LONGTEXT" allows storing huge Readme files (up to 4GB)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String readmeContent;

    // RELATIONSHIP MAPPING
    // Many projects can belong to One user.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private User user;
}