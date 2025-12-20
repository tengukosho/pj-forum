package com.schoolforum.dto;

import lombok.Data;

/**
 * DTO for Thread/Reply Author
 */
@Data
public class AuthorDTO {
    private Long id;
    private String username;
    private String role;
    private String avatar;
}
