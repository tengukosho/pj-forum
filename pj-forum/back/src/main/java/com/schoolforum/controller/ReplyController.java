package com.schoolforum.controller;

import com.schoolforum.dto.CreateReplyRequest;
import com.schoolforum.dto.ReplyDTO;
import com.schoolforum.service.ReplyService;
import com.schoolforum.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CONTROLLER LAYER - Reply Management
 * Endpoints: /api/threads/{threadId}/replies
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Get all replies for a thread
     * GET /api/threads/{threadId}/replies
     */
    @GetMapping("/threads/{threadId}/replies")
    public ResponseEntity<List<ReplyDTO>> getRepliesByThread(@PathVariable Long threadId) {
        List<ReplyDTO> replies = replyService.getRepliesByThread(threadId);
        return ResponseEntity.ok(replies);
    }

    /**
     * Create new reply (authenticated users)
     * POST /api/threads/{threadId}/replies
     */
    @PostMapping("/threads/{threadId}/replies")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReplyDTO> createReply(
            @PathVariable Long threadId,
            @Valid @RequestBody CreateReplyRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        ReplyDTO reply = replyService.createReply(threadId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(reply);
    }

    /**
     * Create new reply - simpler endpoint
     * POST /api/replies
     */
    @PostMapping("/replies")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReplyDTO> createReplySimple(
            @Valid @RequestBody CreateReplyRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        Long threadId = request.getThreadId();
        ReplyDTO reply = replyService.createReply(threadId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(reply);
    }

    /**
     * Update reply (author/moderator/admin)
     * PUT /api/replies/{id}
     */
    @PutMapping("/replies/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReplyDTO> updateReply(
            @PathVariable Long id,
            @Valid @RequestBody CreateReplyRequest request,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        String role = extractRole(httpRequest);
        
        ReplyDTO reply = replyService.updateReply(id, request, userId, role);
        return ResponseEntity.ok(reply);
    }

    /**
     * Delete reply (author/moderator/admin)
     * DELETE /api/replies/{id}
     */
    @DeleteMapping("/replies/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteReply(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        
        Long userId = extractUserId(httpRequest);
        String role = extractRole(httpRequest);
        
        replyService.deleteReply(id, userId, role);
        return ResponseEntity.noContent().build();
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
