package com.schoolforum.dao;

import com.schoolforum.model.ThreadSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * DAO LAYER - ThreadSubscription Data Access Object
 */
@Repository
public interface ThreadSubscriptionDAO extends JpaRepository<ThreadSubscription, Long> {
    
    Optional<ThreadSubscription> findByUserIdAndThreadId(Long userId, Long threadId);
    
    List<ThreadSubscription> findByThreadId(Long threadId);
    
    boolean existsByUserIdAndThreadId(Long userId, Long threadId);
    
    void deleteByUserIdAndThreadId(Long userId, Long threadId);
    
    void deleteByThreadId(Long threadId);
}
