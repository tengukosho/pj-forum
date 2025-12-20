package com.schoolforum.service;

import com.schoolforum.dao.NotificationDAO;
import com.schoolforum.dao.ThreadSubscriptionDAO;
import com.schoolforum.dao.UserDAO;
import com.schoolforum.model.Notification;
import com.schoolforum.model.NotificationType;
import com.schoolforum.model.ThreadSubscription;
import com.schoolforum.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SERVICE LAYER - Notification Business Logic
 */
@Service
public class NotificationService {

    @Autowired
    private NotificationDAO notificationDAO;

    @Autowired
    private ThreadSubscriptionDAO subscriptionDAO;

    @Autowired
    private UserDAO userDAO;

    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationDAO.findByUserId(userId);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationDAO.findByUserIdAndIsRead(userId, false);
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationDAO.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        // Verify ownership
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setRead(true);
        notificationDAO.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationDAO.findByUserIdAndIsRead(userId, false);
        unread.forEach(n -> n.setRead(true));
        notificationDAO.saveAll(unread);
    }

    /**
     * Delete notification
     */
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationDAO.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        // Verify ownership
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notificationDAO.delete(notification);
    }

    /**
     * Subscribe to thread
     */
    @Transactional
    public void subscribeToThread(Long threadId, Long userId) {
        User user = userDAO.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already subscribed
        if (subscriptionDAO.existsByUserIdAndThreadId(userId, threadId)) {
            throw new RuntimeException("Already subscribed to this thread");
        }
        
        ThreadSubscription subscription = new ThreadSubscription();
        subscription.setUser(user);
        subscription.setThread(new com.schoolforum.model.Thread());
        subscription.getThread().setId(threadId);
        subscription.setSubscribedAt(LocalDateTime.now());
        
        subscriptionDAO.save(subscription);
    }

    /**
     * Unsubscribe from thread
     */
    @Transactional
    public void unsubscribeFromThread(Long threadId, Long userId) {
        ThreadSubscription subscription = subscriptionDAO.findByUserIdAndThreadId(userId, threadId)
            .orElseThrow(() -> new RuntimeException("Not subscribed to this thread"));
        
        subscriptionDAO.delete(subscription);
    }

    /**
     * Create notification for thread subscribers (called when new reply is posted)
     */
    @Transactional
    public void notifyThreadSubscribers(Long threadId, String threadTitle, Long replyAuthorId) {
        List<ThreadSubscription> subscriptions = subscriptionDAO.findByThreadId(threadId);
        
        for (ThreadSubscription sub : subscriptions) {
            // Don't notify the reply author
            if (sub.getUser().getId().equals(replyAuthorId)) {
                continue;
            }
            
            Notification notification = new Notification();
            notification.setUser(sub.getUser());
            notification.setType(NotificationType.NEW_REPLY);
            notification.setMessage("New reply in thread: " + threadTitle);
            notification.setRelatedThreadId(threadId);
            notification.setRead(false);
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationDAO.save(notification);
        }
    }
}
