package com.schoolforum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * MODEL LAYER - Category Entity
 * Represents a forum category
 */
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String icon;

    @Column(nullable = false)
    private Integer displayOrder = 0;

    // Relationships
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Thread> threads = new ArrayList<>();
}
