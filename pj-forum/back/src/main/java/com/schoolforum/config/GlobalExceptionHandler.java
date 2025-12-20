package com.schoolforum.config;

import com.schoolforum.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * Catches all exceptions and returns clean JSON responses
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle ResourceNotFoundException (404 errors)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", ex.getMessage());
        error.put("status", 404);
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(error);
    }

    /**
     * Handle RuntimeException (custom business logic errors)
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", ex.getMessage());
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(error);
    }

    /**
     * Handle AccessDeniedException (unauthorized access)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "Access denied: You don't have permission to perform this action");
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(error);
    }

    /**
     * Handle BadCredentialsException (login failures)
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentialsException(BadCredentialsException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "Invalid email or password");
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(error);
    }

    /**
     * Handle IllegalArgumentException (validation errors)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", ex.getMessage());
        error.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(error);
    }

    /**
     * Handle NullPointerException
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(NullPointerException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "Required data is missing");
        error.put("timestamp", LocalDateTime.now());
        
        System.err.println("❌ NullPointerException: " + ex.getMessage());
        ex.printStackTrace();
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(error);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", "An unexpected error occurred");
        error.put("timestamp", LocalDateTime.now());
        
        System.err.println("❌ Unexpected Exception: " + ex.getClass().getName());
        System.err.println("   Message: " + ex.getMessage());
        ex.printStackTrace();
        
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(error);
    }
}
