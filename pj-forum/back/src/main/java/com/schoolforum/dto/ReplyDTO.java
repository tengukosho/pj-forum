package com.schoolforum.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO for Reply Response
 */
@Data
public class ReplyDTO {
    private Long id;
    private String content;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private AuthorDTO author;
}
