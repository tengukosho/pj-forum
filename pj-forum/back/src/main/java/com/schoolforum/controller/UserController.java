package com.schoolforum.controller;

import com.schoolforum.dto.UserDTO;
import com.schoolforum.model.User;
import com.schoolforum.dao.UserDAO;
import com.schoolforum.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private JwtUtil jwtUtil;

    // GET /api/users/{id} - Get user profile by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userDAO.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(convertToDTO(user));
    }

    // GET /api/users/all - Get all users (Admin/Moderator only)
    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            System.out.println("🔍 GET /api/users/all called");
            List<User> users = userDAO.findAll();
            System.out.println("✅ Found " + users.size() + " users");
            
            List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
                
            System.out.println("✅ Returning " + userDTOs.size() + " user DTOs");
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            System.err.println("❌ Error in getAllUsers: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // PUT /api/users/{id} - Update user profile
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates,
            HttpServletRequest request) {
        
        try {
            // Get current user from token
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String currentUserEmail = jwtUtil.extractUsername(token);
            User currentUser = userDAO.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

            User userToUpdate = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // User can only update own profile unless they're admin
            if (!currentUser.getId().equals(id) && 
                currentUser.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403)
                    .body(Map.of("message", "Bạn không có quyền cập nhật người dùng này"));
            }

            // Update fields
            if (updates.containsKey("username")) {
                String username = updates.get("username");
                if (username.length() < 3 || username.length() > 50) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("message", "Tên người dùng phải từ 3-50 ký tự"));
                }
                userToUpdate.setUsername(username);
            }

            if (updates.containsKey("avatar")) {
                userToUpdate.setAvatar(updates.get("avatar"));
            }

            if (updates.containsKey("bio")) {
                userToUpdate.setBio(updates.get("bio"));
            }

            userToUpdate.setUpdatedAt(LocalDateTime.now());
            userDAO.save(userToUpdate);

            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Không thể cập nhật: " + e.getMessage()));
        }
    }

    // PUT /api/users/{id}/ban - Ban user
    @PutMapping("/{id}/ban")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATOR')")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        try {
            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Cannot ban admin
            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Không thể cấm tài khoản ADMIN"));
            }

            user.setStatus(User.UserStatus.BANNED);
            user.setUpdatedAt(LocalDateTime.now());
            userDAO.save(user);

            return ResponseEntity.ok(Map.of("message", "Đã cấm người dùng"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Không thể cấm người dùng: " + e.getMessage()));
        }
    }

    // PUT /api/users/{id}/unban - Unban user
    @PutMapping("/{id}/unban")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'MODERATOR')")
    public ResponseEntity<?> unbanUser(@PathVariable Long id) {
        try {
            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            user.setStatus(User.UserStatus.ACTIVE);
            user.setUpdatedAt(LocalDateTime.now());
            userDAO.save(user);

            return ResponseEntity.ok(Map.of("message", "Đã bỏ cấm người dùng"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Không thể bỏ cấm: " + e.getMessage()));
        }
    }

    // PUT /api/users/{id}/role - Change user role (Admin only)
    @PutMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        
        try {
            String roleStr = payload.get("role");

            // Validate and parse role
            User.Role newRole;
            try {
                newRole = User.Role.valueOf(roleStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Vai trò không hợp lệ"));
            }

            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Cannot demote admin
            if (user.getRole() == User.Role.ADMIN && newRole != User.Role.ADMIN) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Không thể hạ cấp ADMIN"));
            }

            user.setRole(newRole);
            user.setUpdatedAt(LocalDateTime.now());
            userDAO.save(user);

            return ResponseEntity.ok(Map.of("message", "Đã cập nhật vai trò"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Không thể cập nhật vai trò: " + e.getMessage()));
        }
    }

    // Helper method to convert User to UserDTO
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getStatus().name());
        dto.setAvatar(user.getAvatar());
        dto.setBio(user.getBio());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
