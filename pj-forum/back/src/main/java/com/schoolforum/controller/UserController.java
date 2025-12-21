package com.schoolforum.controller;

import com.schoolforum.dto.UserDTO;
import com.schoolforum.model.User;
import com.schoolforum.dao.UserDAO;
import com.schoolforum.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    private User getCurrentUser(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return null;
            }
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            return userDAO.findById(userId).orElse(null);
        } catch (Exception e) {
            System.err.println("Error extracting user from token: " + e.getMessage());
            return null;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userDAO.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(convertToDTO(user));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        try {
            User currentUser = getCurrentUser(request);
            
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }
            
            if (currentUser.getRole() != User.Role.ADMIN && currentUser.getRole() != User.Role.MODERATOR) {
                return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
            }
            
            List<User> users = userDAO.findAll();
            List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> updates,
            HttpServletRequest request) {
        
        try {
            User currentUser = getCurrentUser(request);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }

            User userToUpdate = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (!currentUser.getId().equals(id) && currentUser.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403).body(Map.of("message", "No permission"));
            }

            if (updates.containsKey("username")) {
                userToUpdate.setUsername(updates.get("username"));
            }
            if (updates.containsKey("avatar")) {
                userToUpdate.setAvatar(updates.get("avatar"));
            }
            if (updates.containsKey("bio")) {
                userToUpdate.setBio(updates.get("bio"));
            }

            userToUpdate.setUpdatedAt(LocalDateTime.now());
            userDAO.save(userToUpdate);

            return ResponseEntity.ok(Map.of("message", "Updated"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id, HttpServletRequest request) {
        try {
            User currentUser = getCurrentUser(request);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }
            
            if (currentUser.getRole() != User.Role.ADMIN && currentUser.getRole() != User.Role.MODERATOR) {
                return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
            }
            
            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot ban admin"));
            }

            user.setStatus(User.UserStatus.BANNED);
            userDAO.save(user);

            return ResponseEntity.ok(Map.of("message", "Banned"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id, HttpServletRequest request) {
        try {
            User currentUser = getCurrentUser(request);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }
            
            if (currentUser.getRole() != User.Role.ADMIN && currentUser.getRole() != User.Role.MODERATOR) {
                return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
            }
            
            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            user.setStatus(User.UserStatus.ACTIVE);
            userDAO.save(user);

            return ResponseEntity.ok(Map.of("message", "Unbanned"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        
        try {
            User currentUser = getCurrentUser(request);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }
            
            if (currentUser.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403).body(Map.of("message", "Only admin"));
            }
            
            User.Role newRole = User.Role.valueOf(payload.get("role"));
            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() == User.Role.ADMIN && newRole != User.Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot demote admin"));
            }

            user.setRole(newRole);
            userDAO.save(user);

            return ResponseEntity.ok(Map.of("message", "Role updated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, HttpServletRequest request) {
        try {
            User currentUser = getCurrentUser(request);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
            }
            
            if (currentUser.getRole() != User.Role.ADMIN) {
                return ResponseEntity.status(403).body(Map.of("message", "Only admin"));
            }
            
            User user = userDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete admin"));
            }

            userDAO.delete(user);
            return ResponseEntity.ok(Map.of("message", "Deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

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
