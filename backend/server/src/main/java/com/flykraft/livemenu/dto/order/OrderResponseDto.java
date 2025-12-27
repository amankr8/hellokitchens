package com.flykraft.livemenu.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class OrderResponseDto {
    private Long id;
    private Long kitchenId;
    private String status;
    private String address;
    private BigDecimal totalPrice;
    private List<OrderItemResponseDto> orderItems;
}
