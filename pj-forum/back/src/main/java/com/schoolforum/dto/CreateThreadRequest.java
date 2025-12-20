package com.schoolforum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/**
 * DTO for Create Thread Request
 */
@Data
public class CreateThreadRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    private List<String> tags;
    private Boolean isAnonymous = false;
}
