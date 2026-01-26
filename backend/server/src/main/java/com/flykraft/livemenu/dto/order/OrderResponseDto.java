package com.flykraft.livemenu.dto.order;

import com.flykraft.livemenu.dto.AuditableDto;
import com.flykraft.livemenu.model.OrderStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class OrderResponseDto extends AuditableDto {
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
    private String notes;
    private List<OrderItemResponseDto> orderItems;
}
