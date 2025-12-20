package com.schoolforum.service;

import com.schoolforum.dao.UserDAO;
import com.schoolforum.dto.AuthResponse;
import com.schoolforum.dto.LoginRequest;
import com.schoolforum.dto.RegisterRequest;
import com.schoolforum.dto.UserDTO;
import com.schoolforum.model.User;
import com.schoolforum.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * SERVICE LAYER - Authentication Business Logic
 * Handles user registration, login, and authentication
 */
@Service
@Transactional
public class AuthService {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register new user
     */
    public AuthResponse register(RegisterRequest request) {
        // Validate email format
        String email = request.getEmail();
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            return new AuthResponse(false, "Email không hợp lệ");
        }
        
        // Validate password strength
        String password = request.getPassword();
        if (password.length() < 8) {
            return new AuthResponse(false, "Mật khẩu phải có ít nhất 8 ký tự");
        }
        if (!password.matches(".*[A-Z].*")) {
            return new AuthResponse(false, "Mật khẩu phải có ít nhất 1 chữ HOA");
        }
        if (!password.matches(".*[a-z].*")) {
            return new AuthResponse(false, "Mật khẩu phải có ít nhất 1 chữ thường");
        }
        if (!password.matches(".*[0-9].*")) {
            return new AuthResponse(false, "Mật khẩu phải có ít nhất 1 chữ số");
        }
        
        // Check if username exists
        if (userDAO.existsByUsername(request.getUsername())) {
            return new AuthResponse(false, "Tên đăng nhập đã tồn tại");
        }

        // Check if email exists
        if (userDAO.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email đã được sử dụng");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.USER);
        user.setStatus(User.UserStatus.ACTIVE);

        // Save to database (using DAO)
        user = userDAO.save(user);

        return new AuthResponse(true, "Đăng ký thành công");
    }

    /**
     * Login user
     */
    public AuthResponse login(LoginRequest request) {
        System.out.println("🔍 LOGIN ATTEMPT - Email: " + request.getEmail());
        
        // Find user by email (using DAO)
        User user = userDAO.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            System.out.println("❌ User not found in database for email: " + request.getEmail());
            return new AuthResponse(false, "Invalid email or password");
        }
        
        System.out.println("✅ User found: " + user.getUsername() + " (ID: " + user.getId() + ")");
        System.out.println("🔐 Stored hash: " + user.getPassword().substring(0, 20) + "...");
        System.out.println("🔑 Input password: " + request.getPassword());

        // Check if user is banned
        if (user.getStatus() == User.UserStatus.BANNED) {
            System.out.println("🚫 User is BANNED");
            return new AuthResponse(false, "Your account has been banned");
        }

        // Verify password
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("🔒 Password match result: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("❌ Password does not match");
            return new AuthResponse(false, "Invalid email or password");
        }
        
        System.out.println("✅ Login successful for user: " + user.getUsername());

        // Update last login time
        user.setLastLoginAt(LocalDateTime.now());
        userDAO.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(
            user.getUsername(),
            user.getId(),
            user.getRole().name()
        );

        // Create user DTO (without password)
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().name());
        userDTO.setStatus(user.getStatus().name());
        userDTO.setBio(user.getBio());
        userDTO.setAvatar(user.getAvatar());

        return new AuthResponse(true, "Login successful", token, userDTO);
    }

    /**
     * Get current user info
     */
    public UserDTO getCurrentUser(Long userId) {
        User user = userDAO.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().name());
        userDTO.setStatus(user.getStatus().name());
        userDTO.setBio(user.getBio());
        userDTO.setAvatar(user.getAvatar());

        return userDTO;
    }
}
