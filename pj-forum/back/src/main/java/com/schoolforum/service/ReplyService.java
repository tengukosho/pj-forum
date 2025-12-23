package com.schoolforum.service;

import com.schoolforum.dao.ReplyDAO;
import com.schoolforum.dao.ThreadDAO;
import com.schoolforum.dao.UserDAO;
import com.schoolforum.dto.AuthorDTO;
import com.schoolforum.dto.CreateReplyRequest;
import com.schoolforum.dto.ReplyDTO;
import com.schoolforum.model.Reply;
import com.schoolforum.model.Thread;
import com.schoolforum.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SERVICE LAYER - Reply Business Logic
 */
@Service
public class ReplyService {

    @Autowired
    private ReplyDAO replyDAO;

    @Autowired
    private ThreadDAO threadDAO;

    @Autowired
    private UserDAO userDAO;

    /**
     * Get all replies for a thread
     */
    public List<ReplyDTO> getRepliesByThread(Long threadId) {
        List<Reply> replies = replyDAO.findByThreadId(threadId);
        return replies.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    /**
     * Create new reply
     */
    @Transactional
    public ReplyDTO createReply(Long threadId, CreateReplyRequest request, Long userId) {
        Thread thread = threadDAO.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        User author = userDAO.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Reply reply = new Reply();
        reply.setContent(request.getContent());
        reply.setThread(thread);
        reply.setAuthor(author);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        
        Reply saved = replyDAO.save(reply);
        
        // Update thread's last reply time
        thread.setLastReplyAt(LocalDateTime.now());
        threadDAO.save(thread);
        
        return convertToDTO(saved);
    }
    /**
     * Delete reply
     */
    @Transactional
    public void deleteReply(Long replyId, Long userId, String userRole) {
        Reply reply = replyDAO.findById(replyId)
            .orElseThrow(() -> new RuntimeException("Reply not found"));
        
        // Check permission: author, moderator, or admin
        if (!reply.getAuthor().getId().equals(userId) && 
            !userRole.equals("MODERATOR") && 
            !userRole.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to delete this reply");
        }
        
        replyDAO.delete(reply);
    }

    // ===== DTO Conversion =====
    
    private ReplyDTO convertToDTO(Reply reply) {
        ReplyDTO dto = new ReplyDTO();
        dto.setId(reply.getId());
        dto.setContent(reply.getContent());
        dto.setAuthor(convertToAuthorDTO(reply.getAuthor()));
        dto.setCreatedAt(reply.getCreatedAt());
        dto.setUpdatedAt(reply.getUpdatedAt());
        return dto;
    }
    
    private AuthorDTO convertToAuthorDTO(User user) {
        AuthorDTO dto = new AuthorDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setAvatar(user.getAvatar());
        dto.setRole(user.getRole().name());
        return dto;
    }
}
