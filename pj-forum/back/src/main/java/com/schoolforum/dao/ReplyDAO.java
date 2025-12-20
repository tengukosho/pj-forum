package com.schoolforum.dao;

import com.schoolforum.model.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DAO LAYER - Reply Data Access Object
 * Handles all database operations for Reply entity
 */
@Repository
public interface ReplyDAO extends JpaRepository<Reply, Long> {

    // Find replies by thread with pagination
    Page<Reply> findByThreadIdOrderByCreatedAtAsc(Long threadId, Pageable pageable);

    // Find replies by author
    Page<Reply> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    // Count replies in a thread
    long countByThreadId(Long threadId);

    // Find all replies in a thread (no pagination)
    List<Reply> findByThreadIdOrderByCreatedAtAsc(Long threadId);
    
    // Find by thread ID (simple method for service layer)
    List<Reply> findByThreadId(Long threadId);

    // Delete all replies in a thread
    void deleteByThreadId(Long threadId);
}
