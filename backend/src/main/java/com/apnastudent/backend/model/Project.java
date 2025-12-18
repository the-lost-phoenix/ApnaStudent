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

    // @Lob tells JPA this is a Large Object
    // "TEXT" maps to TEXT in Postgres (Unlimited) and TEXT in MySQL (64KB).
    // For wider compatibility or larger files in MySQL, we relies on JPA/Hibernate dialect handling.
    @Lob
    @Column(columnDefinition = "TEXT")
    private String readmeContent;

    // RELATIONSHIP MAPPING
    // Many projects can belong to One user.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private User user;
}