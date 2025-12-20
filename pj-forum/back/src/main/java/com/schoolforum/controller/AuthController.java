package com.schoolforum.controller;

import com.schoolforum.dto.AuthResponse;
import com.schoolforum.dto.LoginRequest;
import com.schoolforum.dto.RegisterRequest;
import com.schoolforum.dto.UserDTO;
import com.schoolforum.service.AuthService;
import com.schoolforum.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * CONTROLLER LAYER - Authentication REST API
 * Handles HTTP requests for user authentication
 * Base URL: /api/auth
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Register new user
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * Get current authenticated user
     * GET /api/auth/me
     * Requires: JWT token in Authorization header
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(HttpServletRequest request) {
        // Extract token from Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        
        // Extract user ID from JWT token
        Long userId = jwtUtil.extractUserId(token);
        
        UserDTO user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(user);
    }

    /**
     * Logout user
     * POST /api/auth/logout
     * Note: With JWT, logout is handled on frontend by removing token
     */
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        return ResponseEntity.ok(
            new AuthResponse(true, "Logout successful")
        );
    }
}
