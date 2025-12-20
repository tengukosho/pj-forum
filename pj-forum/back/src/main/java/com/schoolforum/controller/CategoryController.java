package com.schoolforum.controller;

import com.schoolforum.dto.CategoryDTO;
import com.schoolforum.model.Category;
import com.schoolforum.dao.CategoryDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CONTROLLER LAYER - Category Management
 * Endpoints: /api/categories
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CategoryController {

    @Autowired
    private CategoryDAO categoryDAO;

    /**
     * Get all categories
     * GET /api/categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<Category> categories = categoryDAO.findAll();
        
        List<CategoryDTO> dtos = categories.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }

    /**
     * Get category by ID
     * GET /api/categories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryDAO.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        return ResponseEntity.ok(convertToDTO(category));
    }

    /**
     * Create new category (ADMIN only)
     * POST /api/categories
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        
        Category saved = categoryDAO.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(saved));
    }

    /**
     * Update category (ADMIN only)
     * PUT /api/categories/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDTO dto) {
        
        Category category = categoryDAO.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        
        Category updated = categoryDAO.save(category);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    /**
     * Delete category (ADMIN only)
     * DELETE /api/categories/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryDAO.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Helper method to convert Entity to DTO
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}
