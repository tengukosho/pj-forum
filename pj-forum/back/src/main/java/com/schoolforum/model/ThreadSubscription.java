package com.schoolforum.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * MODEL LAYER - ThreadSubscription Entity
 * Tracks which users are subscribed to which threads
 */
@Entity
@Table(name = "thread_subscriptions", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "thread_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreadSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private Thread thread;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime subscribedAt;
}
