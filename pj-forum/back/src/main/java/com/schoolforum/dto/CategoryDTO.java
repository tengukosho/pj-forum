package com.schoolforum.dto;

import lombok.Data;

/**
 * DTO for Category
 */
@Data
public class CategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
}
