package com.schoolforum.dao;

import com.schoolforum.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * DAO LAYER - User Data Access Object
 * Handles all database operations for User entity
 */
@Repository
public interface UserDAO extends JpaRepository<User, Long> {

    // Find user by username
    Optional<User> findByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);

    // Check if username exists
    boolean existsByUsername(String username);

    // Check if email exists
    boolean existsByEmail(String email);

    // Find users by role
    List<User> findByRole(User.Role role);

    // Find users by status
    List<User> findByStatus(User.UserStatus status);

    // Find inactive users (haven't logged in for X days)
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :cutoffDate AND u.role = 'USER'")
    List<User> findInactiveUsers(LocalDateTime cutoffDate);

    // Search users by username or email
    @Query("SELECT u FROM User u WHERE u.username LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(String keyword);
}
