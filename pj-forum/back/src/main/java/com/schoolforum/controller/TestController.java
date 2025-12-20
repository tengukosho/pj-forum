package com.schoolforum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/hash")
    public String testHash(@RequestParam String password) {
        String hash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
        boolean matches = passwordEncoder.matches(password, hash);
        
        String newHash = passwordEncoder.encode(password);
        
        return "Password: " + password + "\n" +
               "Old Hash: " + hash + "\n" +
               "Matches: " + matches + "\n" +
               "New Hash: " + newHash;
    }
}
