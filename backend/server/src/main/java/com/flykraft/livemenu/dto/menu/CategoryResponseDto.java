package com.flykraft.livemenu.dto.menu;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CategoryResponseDto {
    private Long id;
    private String name;
}
