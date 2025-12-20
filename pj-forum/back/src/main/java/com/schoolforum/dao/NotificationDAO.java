package com.schoolforum.dao;

import com.schoolforum.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * DAO LAYER - Notification Data Access Object
 */
@Repository
public interface NotificationDAO extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);
    
    long countByUserIdAndIsReadFalse(Long userId);
    
    void deleteByUserId(Long userId);
}
