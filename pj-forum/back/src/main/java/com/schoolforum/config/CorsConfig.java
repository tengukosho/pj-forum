package com.schoolforum.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration class for CORS properties
 * Binds cors.* properties from application.properties
 */
@Data
@Component
@ConfigurationProperties(prefix = "cors")
public class CorsConfig {
    private String allowedOrigins;
}
