package com.flykraft.livemenu.dto.menu;

import com.flykraft.livemenu.model.Category;
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
