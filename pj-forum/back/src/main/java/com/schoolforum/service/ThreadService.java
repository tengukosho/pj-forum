package com.schoolforum.service;

import com.schoolforum.dao.*;
import com.schoolforum.dto.*;
import com.schoolforum.exception.ResourceNotFoundException;
import com.schoolforum.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SERVICE LAYER - Thread Business Logic
 */
@Service
public class ThreadService {

    @Autowired
    private ThreadDAO threadDAO;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private CategoryDAO categoryDAO;

    @Autowired
    private TagDAO tagDAO;

    @Autowired
    private ReplyDAO replyDAO;

    /**
     * Get all threads with pagination
     */
    public Page<ThreadListDTO> getAllThreads(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<com.schoolforum.model.Thread> threads = threadDAO.findAll(pageable);
        
        return threads.map(this::convertToListDTO);
    }

    /**
     * Get threads by category
     */
    public List<ThreadListDTO> getThreadsByCategory(Long categoryId) {
        Pageable pageable = PageRequest.of(0, 100);
        Page<com.schoolforum.model.Thread> threads = threadDAO.findByCategoryId(categoryId, pageable);
        return threads.stream()
            .map(this::convertToListDTO)
            .collect(Collectors.toList());
    }

    /**
     * Get threads by category with pagination
     */
    public Page<ThreadListDTO> getThreadsByCategoryPaged(Long categoryId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<com.schoolforum.model.Thread> threads = threadDAO.findByCategoryId(categoryId, pageable);
        return threads.map(this::convertToListDTO);
    }

    /**
     * Get thread by ID with full details
     */
    @Transactional
    public ThreadDTO getThreadById(Long id) {
        com.schoolforum.model.Thread thread = threadDAO.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Thread", "id", id));
        
        // Increment view count using atomic update (prevents version lock)
        try {
            threadDAO.incrementViewCount(id);
        } catch (Exception e) {
            // Ignore view count errors - not critical
        }
        
        return convertToDetailDTO(thread);
    }

    /**
     * Create new thread
     */
    @Transactional
    public ThreadDTO createThread(CreateThreadRequest request, Long userId) {
        User author = userDAO.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryDAO.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        com.schoolforum.model.Thread thread = new com.schoolforum.model.Thread();
        thread.setTitle(request.getTitle());
        thread.setContent(request.getContent());
        thread.setAuthor(author);
        thread.setCategory(category);
        thread.setPinned(false);
        thread.setLocked(false);
        thread.setViewCount(0);
        thread.setCreatedAt(LocalDateTime.now());
        thread.setUpdatedAt(LocalDateTime.now());
        
        // Handle tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<Tag> tags = request.getTags().stream()
                .map(tagName -> tagDAO.findByName(tagName)
                    .orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(tagName);
                        return tagDAO.save(newTag);
                    }))
                .collect(Collectors.toList());
            thread.setTags(tags);
        }
        
        com.schoolforum.model.Thread saved = threadDAO.save(thread);
        return convertToDetailDTO(saved);
    }

    /**
     * Update thread
     */
    @Transactional
    public ThreadDTO updateThread(Long threadId, CreateThreadRequest request, Long userId, String userRole) {
        com.schoolforum.model.Thread thread = threadDAO.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        // Check permission: author, moderator, or admin
        if (!thread.getAuthor().getId().equals(userId) && 
            !userRole.equals("MODERATOR") && 
            !userRole.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to edit this thread");
        }
        
        thread.setTitle(request.getTitle());
        thread.setContent(request.getContent());
        thread.setUpdatedAt(LocalDateTime.now());
        
        if (request.getCategoryId() != null) {
            Category category = categoryDAO.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            thread.setCategory(category);
        }
        
        com.schoolforum.model.Thread updated = threadDAO.save(thread);
        return convertToDetailDTO(updated);
    }

    /**
     * Delete thread
     */
    @Transactional
    public void deleteThread(Long threadId, Long userId, String userRole) {
        com.schoolforum.model.Thread thread = threadDAO.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        // Check permission: author, moderator, or admin
        if (!thread.getAuthor().getId().equals(userId) && 
            !userRole.equals("MODERATOR") && 
            !userRole.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to delete this thread");
        }
        
        threadDAO.delete(thread);
    }

    /**
     * Pin/Unpin thread (MODERATOR/ADMIN only)
     */
    @Transactional
    public void togglePin(Long threadId) {
        com.schoolforum.model.Thread thread = threadDAO.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        thread.setPinned(!thread.isPinned());
        threadDAO.save(thread);
    }

    /**
     * Lock/Unlock thread (MODERATOR/ADMIN only)
     */
    @Transactional
    public void toggleLock(Long threadId) {
        com.schoolforum.model.Thread thread = threadDAO.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found"));
        
        thread.setLocked(!thread.isLocked());
        threadDAO.save(thread);
    }

    // ===== DTO Conversion Methods =====
    
    private ThreadListDTO convertToListDTO(com.schoolforum.model.Thread thread) {
        ThreadListDTO dto = new ThreadListDTO();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setAuthor(convertToAuthorDTO(thread.getAuthor()));
        dto.setCategoryName(thread.getCategory().getName());
        dto.setReplyCount(replyDAO.countByThreadId(thread.getId()));
        dto.setViewCount(thread.getViewCount());
        dto.setPinned(thread.isPinned());
        dto.setLocked(thread.isLocked());
        dto.setCreatedAt(thread.getCreatedAt());
        dto.setLastReplyAt(thread.getLastReplyAt());
        
        if (thread.getTags() != null) {
            dto.setTags(thread.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private ThreadDTO convertToDetailDTO(com.schoolforum.model.Thread thread) {
        ThreadDTO dto = new ThreadDTO();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setContent(thread.getContent());
        dto.setAuthor(convertToAuthorDTO(thread.getAuthor()));
        dto.setCategoryId(thread.getCategory().getId());
        dto.setCategoryName(thread.getCategory().getName());
        dto.setViewCount(thread.getViewCount());
        dto.setPinned(thread.isPinned());
        dto.setLocked(thread.isLocked());
        dto.setCreatedAt(thread.getCreatedAt());
        dto.setUpdatedAt(thread.getUpdatedAt());
        
        if (thread.getTags() != null) {
            dto.setTags(thread.getTags().stream()
                .map(tag -> {
                    TagDTO tagDTO = new TagDTO();
                    tagDTO.setId(tag.getId());
                    tagDTO.setName(tag.getName());
                    return tagDTO;
                })
                .collect(Collectors.toList()));
        }
        
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
