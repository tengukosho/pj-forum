package com.schoolforum.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Thread Response
 */
@Data
public class ThreadDTO {
    private Long id;
    private String title;
    private String content;
    private Boolean isAnonymous;
    private Boolean isPinned;
    private Integer replyCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastReplyAt;
    private AuthorDTO author;
    private CategoryDTO category;
    private Long categoryId; // For simple category ID
    private String categoryName; // For simple category name
    private List<TagDTO> tags;
    private List<ReplyDTO> replies;
    
    // Helper methods for compatibility
    public void setPinned(boolean pinned) {
        this.isPinned = pinned;
    }
    
    public void setLocked(boolean locked) {
        this.isLocked = locked;
    }
}
