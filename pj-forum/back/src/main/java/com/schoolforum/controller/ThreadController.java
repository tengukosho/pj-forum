package com.schoolforum.controller;

import com.schoolforum.dto.CreateThreadRequest;
import com.schoolforum.dto.ThreadDTO;
import com.schoolforum.dto.ThreadListDTO;
import com.schoolforum.service.ThreadService;
import com.schoolforum.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER LAYER - Thread Management
 * Endpoints: /api/threads
 */
@RestController
@RequestMapping("/api/threads")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ThreadController {

    @Autowired
    private ThreadService threadService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get all threads with pagination and optional category filter
     * GET /api/threads?page=0&size=20&sort=createdAt&categoryId=1
     */
    @GetMapping
    public ResponseEntity<Page<ThreadListDTO>> getAllThreads(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort) {
        
        Page<ThreadListDTO> threads;
        if (categoryId != null) {
            threads = threadService.getThreadsByCategoryPaged(categoryId, page, size, sort);
        } else {
            threads = threadService.getAllThreads(page, size, sort);
        }
        return ResponseEntity.ok(threads);
    }

    /**
     * Get threads by category
     * GET /api/threads/category/{categoryId}
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ThreadListDTO>> getThreadsByCategory(@PathVariable Long categoryId) {
        List<ThreadListDTO> threads = threadService.getThreadsByCategory(categoryId);
        return ResponseEntity.ok(threads);
    }

    /**
     * Get thread by ID with full details
     * GET /api/threads/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ThreadDTO> getThreadById(@PathVariable Long id) {
        ThreadDTO thread = threadService.getThreadById(id);
        return ResponseEntity.ok(thread);
    }

    /**
     * Create new thread (authenticated users)
     * POST /api/threads
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ThreadDTO> createThread(
            @Valid @RequestBody CreateThreadRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        ThreadDTO thread = threadService.createThread(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(thread);
    }

    /**
     * Update thread (author/moderator/admin)
     * PUT /api/threads/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ThreadDTO> updateThread(
            @PathVariable Long id,
            @Valid @RequestBody CreateThreadRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        String role = extractRole(httpRequest);
        
        ThreadDTO thread = threadService.updateThread(id, request, userId, role);
        return ResponseEntity.ok(thread);
    }

    /**
     * Delete thread (author/moderator/admin)
     * DELETE /api/threads/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteThread(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        String role = extractRole(httpRequest);
        
        threadService.deleteThread(id, userId, role);
        return ResponseEntity.noContent().build();
    }

    /**
     * Pin/Unpin thread (MODERATOR/ADMIN only)
     * POST /api/threads/{id}/pin
     */
    @PostMapping("/{id}/pin")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Void> togglePin(@PathVariable Long id) {
        threadService.togglePin(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Lock/Unlock thread (MODERATOR/ADMIN only)
     * POST /api/threads/{id}/lock
     */
    @PostMapping("/{id}/lock")
    @PreAuthorize("hasAnyRole('MODERATOR', 'ADMIN')")
    public ResponseEntity<Void> toggleLock(@PathVariable Long id) {
        threadService.toggleLock(id);
        return ResponseEntity.ok().build();
    }

    // Helper methods to extract user info from JWT
    private Long extractUserId(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractUserId(token);
    }

    private String extractRole(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        return jwtUtil.extractRole(token);
    }
}
