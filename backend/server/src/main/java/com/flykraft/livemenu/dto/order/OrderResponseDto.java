package com.flykraft.livemenu.dto.order;

import com.flykraft.livemenu.model.OrderStatus;
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
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private OrderStatus status;
    private BigDecimal totalPrice;
    private List<OrderItemResponseDto> orderItems;
}
