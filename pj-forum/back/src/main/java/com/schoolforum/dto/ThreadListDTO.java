package com.schoolforum.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Thread List (lighter version)
 */
@Data
public class ThreadListDTO {
    private Long id;
    private String title;
    private Boolean isAnonymous;
    private Boolean isPinned;
    private Boolean isLocked;
    private Integer replyCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastReplyAt;
    private AuthorDTO author;
    private CategoryDTO category;
    private String categoryName; // For simple category name
    private List<String> tags; // Simple tag names
    
    // Helper methods for compatibility
    public void setPinned(boolean pinned) {
        this.isPinned = pinned;
    }
    
    public void setLocked(boolean locked) {
        this.isLocked = locked;
    }
    
    public void setReplyCount(long count) {
        this.replyCount = (int) count;
    }
}
