package com.schoolforum.dao;

import com.schoolforum.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DAO LAYER - Tag Data Access Object
 */
@Repository
public interface TagDAO extends JpaRepository<Tag, Long> {
    
    Optional<Tag> findByName(String name);
    
    Optional<Tag> findBySlug(String slug);
    
    List<Tag> findByNameIn(List<String> names);
    
    boolean existsByName(String name);
}
