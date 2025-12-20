package com.schoolforum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * MODEL LAYER - Thread Entity
 * Represents a forum thread/discussion topic
 */
@Entity
@Table(name = "threads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Thread {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Boolean isAnonymous = false;

    @Column(nullable = false)
    private Boolean isPinned = false;

    @Column(nullable = false)
    private Boolean isLocked = false;

    @Column(nullable = false)
    private Integer views = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime lastReplyAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reply> replies = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "thread_tags",
        joinColumns = @JoinColumn(name = "thread_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ThreadSubscription> subscriptions = new ArrayList<>();
    
    // Helper methods for boolean checks
    public boolean isLocked() {
        return this.isLocked != null && this.isLocked;
    }
    
    public boolean isPinned() {
        return this.isPinned != null && this.isPinned;
    }
    
    public void setPinned(boolean pinned) {
        this.isPinned = pinned;
    }
    
    public void setLocked(boolean locked) {
        this.isLocked = locked;
    }
    
    // Helper for view count
    public Integer getViewCount() {
        return this.views != null ? this.views : 0;
    }
    
    public void setViewCount(Integer count) {
        this.views = count;
    }
}
