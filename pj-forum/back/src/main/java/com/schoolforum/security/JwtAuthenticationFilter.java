package com.schoolforum.security;

import com.schoolforum.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT Authentication Filter
 * Intercepts every request and validates JWT token from Authorization header
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Get Authorization header
        String authHeader = request.getHeader("Authorization");

        // Check if header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract token (remove "Bearer " prefix)
            String token = authHeader.substring(7);

            // Validate token
            if (jwtUtil.validateToken(token)) {
                // Extract user info from token
                String username = jwtUtil.extractUsername(token);
                Long userId = jwtUtil.extractUserId(token);
                String role = jwtUtil.extractRole(token);

                // Create authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );

                // Add request details
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Store userId in authentication (we'll need it later)
                // Note: You can create a custom Authentication object if needed
                
                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("✅ JWT Authenticated: " + username + " (ID: " + userId + ", Role: " + role + ")");
            }

        } catch (Exception e) {
            System.err.println("❌ JWT Authentication failed: " + e.getMessage());
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}
