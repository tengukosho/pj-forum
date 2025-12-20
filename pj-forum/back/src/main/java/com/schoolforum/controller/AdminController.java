package com.schoolforum.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * CONTROLLER LAYER - Admin Settings
 * Endpoints: /api/admin
 * Only ADMIN role can access
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Value("${forum.thread.auto-delete-days:90}")
    private int autoDeleteDays;

    /**
     * Get current forum settings
     * GET /api/admin/settings
     */
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("autoDeleteDays", autoDeleteDays);
        settings.put("autoDeleteEnabled", autoDeleteDays > 0);
        
        return ResponseEntity.ok(settings);
    }

    /**
     * Update auto-delete days setting
     * PUT /api/admin/settings/auto-delete-days
     * 
     * Request body: { "days": 90 }
     * Set to 0 to disable auto-delete
     */
    @PutMapping("/settings/auto-delete-days")
    public ResponseEntity<Map<String, Object>> updateAutoDeleteDays(@RequestBody Map<String, Integer> request) {
        Integer days = request.get("days");
        
        if (days == null || days < 0) {
            throw new IllegalArgumentException("Days must be 0 or positive number");
        }
        
        try {
            updatePropertyFile("forum.thread.auto-delete-days", days.toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", days == 0 ? 
                "Auto-delete disabled" : 
                "Auto-delete set to " + days + " days");
            response.put("autoDeleteDays", days);
            response.put("requiresRestart", true);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to update settings: " + e.getMessage());
        }
    }

    /**
     * Helper method to update application.properties
     */
    private void updatePropertyFile(String key, String value) throws IOException {
        String propertiesPath = "src/main/resources/application.properties";
        
        // Read all lines
        java.util.List<String> lines = Files.readAllLines(Paths.get(propertiesPath));
        
        // Update or add the property
        boolean found = false;
        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i).trim();
            if (line.startsWith(key + "=")) {
                lines.set(i, key + "=" + value);
                found = true;
                break;
            }
        }
        
        // If not found, add it
        if (!found) {
            lines.add(key + "=" + value);
        }
        
        // Write back
        Files.write(Paths.get(propertiesPath), lines);
    }
}
