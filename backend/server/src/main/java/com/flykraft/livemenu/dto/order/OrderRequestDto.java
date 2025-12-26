package com.flykraft.livemenu.dto.order;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDto {
    private Long kitchenId;
    private String customerPhone;
    private List<OrderItemRequestDto> orderItems;
}
