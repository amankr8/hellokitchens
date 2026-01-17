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
    private String streetAddress;
    private String deliveryAddress;
    private String location;
    private OrderStatus status;
    private BigDecimal subtotal;
    private BigDecimal packingCharges;
    private BigDecimal deliveryFees;
    private BigDecimal taxes;
    private BigDecimal totalAmount;
    private String specialInstructions;
    private List<OrderItemResponseDto> orderItems;
}
