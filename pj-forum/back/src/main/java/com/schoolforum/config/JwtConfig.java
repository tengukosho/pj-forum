package com.schoolforum.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration class for JWT properties
 * Binds jwt.* properties from application.properties
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String secret;
    private Long expiration;
}
