package com.schoolforum.service;

import com.schoolforum.dao.ThreadDAO;
import com.schoolforum.model.Thread;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SERVICE LAYER - Scheduled Tasks
 * Auto-delete old threads based on admin settings
 */
@Service
public class ScheduledTaskService {

    @Autowired
    private ThreadDAO threadDAO;

    // Default: 90 days (configurable in application.properties)
    @Value("${forum.thread.auto-delete-days:90}")
    private int autoDeleteDays;

    /**
     * Auto-delete old threads
     * Runs every day at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void deleteOldThreads() {
        if (autoDeleteDays <= 0) {
            // Auto-delete disabled
            return;
        }

        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(autoDeleteDays);
        
        System.out.println("🗑️  Running auto-delete task...");
        System.out.println("   Deleting threads older than: " + cutoffDate);
        
        List<Thread> oldThreads = threadDAO.findByCreatedAtBefore(cutoffDate);
        
        if (oldThreads.isEmpty()) {
            System.out.println("   No threads to delete.");
            return;
        }
        
        int count = oldThreads.size();
        threadDAO.deleteAll(oldThreads);
        
        System.out.println("✅ Deleted " + count + " old threads.");
    }

    /**
     * Clean up old notifications
     * Runs every week on Sunday at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * SUN")
    @Transactional
    public void cleanOldNotifications() {
        // Delete read notifications older than 30 days
        System.out.println("🧹 Cleaning old notifications...");
        // TODO: Implement if needed
    }
}
