package com.schoolforum.controller;

import com.schoolforum.model.Notification;
import com.schoolforum.service.NotificationService;
import com.schoolforum.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER LAYER - Notification Management
 * Endpoints: /api/notifications
 */
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get all notifications for current user
     * GET /api/notifications
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUserNotifications(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get unread notifications for current user
     * GET /api/notifications/unread
     */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotifications(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/read-all
     */
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete notification
     * DELETE /api/notifications/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Subscribe to thread
     * POST /api/notifications/subscribe/{threadId}
     */
    @PostMapping("/subscribe/{threadId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> subscribeToThread(
            @PathVariable Long threadId,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        notificationService.subscribeToThread(threadId, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Unsubscribe from thread
     * DELETE /api/notifications/subscribe/{threadId}
     */
    @DeleteMapping("/subscribe/{threadId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unsubscribeFromThread(
            @PathVariable Long threadId,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        notificationService.unsubscribeFromThread(threadId, userId);
        return ResponseEntity.noContent().build();
    }

    // Helper method to extract user ID from JWT
    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }
}
