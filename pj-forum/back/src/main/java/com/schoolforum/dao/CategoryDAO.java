package com.schoolforum.dao;

import com.schoolforum.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DAO LAYER - Category Data Access Object
 */
@Repository
public interface CategoryDAO extends JpaRepository<Category, Long> {
    
    Optional<Category> findBySlug(String slug);
    
    boolean existsByName(String name);
    
    boolean existsBySlug(String slug);
    
    List<Category> findAllByOrderByDisplayOrderAsc();
}
