package com.schoolforum.dao;

import com.schoolforum.model.Thread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ThreadDAO extends JpaRepository<Thread, Long> {
    
    Page<Thread> findByCategoryId(Long categoryId, Pageable pageable);
    
    List<Thread> findByAuthorId(Long authorId);
    
    List<Thread> findByUpdatedAtBefore(LocalDateTime cutoffDate);
    
    List<Thread> findByCreatedAtBefore(LocalDateTime cutoffDate);
}
