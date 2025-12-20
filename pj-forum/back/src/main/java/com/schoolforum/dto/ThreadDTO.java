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
    private Boolean isLocked;
    private Integer views;
    private Integer viewCount; // Alias for compatibility
    private Integer replyCount;
    private Integer subscriptionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastReplyAt;
    private AuthorDTO author;
    private CategoryDTO category;
    private Long categoryId; // For simple category ID
    private String categoryName; // For simple category name
    private List<TagDTO> tags;
    
    // Helper methods for compatibility
    public void setPinned(boolean pinned) {
        this.isPinned = pinned;
    }
    
    public void setLocked(boolean locked) {
        this.isLocked = locked;
    }
    
    public void setViewCount(Integer count) {
        this.viewCount = count;
        this.views = count;
    }
}
