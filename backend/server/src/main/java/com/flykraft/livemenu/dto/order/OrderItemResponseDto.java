package com.flykraft.livemenu.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class OrderItemResponseDto {
    private Long id;
    private Long menuItemId;
    private Integer quantity;
    private BigDecimal price;
}
