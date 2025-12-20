package com.schoolforum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * MAIN APPLICATION CLASS
 * Entry point for Spring Boot application
 * 
 * Architecture:
 * - MODEL Layer: Entity classes (User, Thread, Reply, etc.)
 * - DAO Layer: Repository interfaces for database access
 * - SERVICE Layer: Business logic
 * - CONTROLLER Layer: REST API endpoints
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@ConfigurationPropertiesScan("com.schoolforum.config")
public class ForumApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForumApplication.class, args);
        System.out.println("==============================================");
        System.out.println("🚀 School Forum Backend is running!");
        System.out.println("📍 Server: http://localhost:8080");
        System.out.println("📊 API Documentation: http://localhost:8080/api");
        System.out.println("==============================================");
    }
}
