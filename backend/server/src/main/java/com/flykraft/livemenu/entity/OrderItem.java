package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.order.OrderItemResponseDto;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "oi_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "o_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "mi_id", nullable = false)
    private MenuItem menuItem;

    @Column(name = "oi_item_name", nullable = false)
    private String itemName;

    @Column(name = "oi_quantity", nullable = false)
    private Integer quantity;

    @Column(name = "oi_price", nullable = false)
    private BigDecimal price;

    public OrderItemResponseDto toResponseDto() {
        return OrderItemResponseDto.builder()
                .id(this.id)
                .menuItemId(this.menuItem.getId())
                .itemName(this.itemName)
                .quantity(this.quantity)
                .price(this.price)
                .build();
    }
}
