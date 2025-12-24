package com.flykraft.menu_service.dto.menu;

import com.flykraft.menu_service.model.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class MenuItemRequestDto {
    private String name;
    private String desc;
    private Category category;
    private Boolean isVeg;
    private BigDecimal price;
}
