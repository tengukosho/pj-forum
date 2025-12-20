package com.schoolforum.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Authentication Response
 */
@Data
@NoArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private UserDTO user;
    
    // Constructor for simple success/error messages
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    // Constructor for login response with token
    public AuthResponse(boolean success, String message, String token, UserDTO user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }
}
