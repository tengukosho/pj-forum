package com.schoolforum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for Create Reply Request
 */
@Data
public class CreateReplyRequest {
    
    @NotNull(message = "Thread ID is required")
    private Long threadId;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private Boolean isAnonymous = false;
}
