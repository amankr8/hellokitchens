package com.flykraft.livemenu.dto.order;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemRequestDto {
    private Long menuItemId;
    private Integer quantity;
    private BigDecimal price;
}
