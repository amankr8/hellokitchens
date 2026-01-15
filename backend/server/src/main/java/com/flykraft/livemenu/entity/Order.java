package com.flykraft.livemenu.entity;

import com.flykraft.livemenu.dto.order.OrderResponseDto;
import com.flykraft.livemenu.model.Auditable;
import com.flykraft.livemenu.model.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Filter(name = "kitchenFilter", condition = "k_id = :kitchenId")
@Entity
@Table(name = "orders")
public class Order extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "o_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "k_id", nullable = false)
    private Kitchen kitchen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "u_id")
    private User user;

    @Column(name = "o_customer_name", nullable = false)
    private String customerName;

    @Column(name = "o_customer_phone", nullable = false)
    private String customerPhone;

    @Column(name = "o_delivery_street", nullable = false)
    private String deliveryStreet;

    @Column(name = "o_delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "o_delivery_pluscode", nullable = false)
    private String deliveryPluscode;

    @Enumerated(EnumType.STRING)
    @Column(name = "o_status", nullable = false)
    private OrderStatus status;

    @Column(name = "o_subtotal", nullable = false)
    private BigDecimal subTotal;

    @Column(name = "o_packing_charges", nullable = false)
    private BigDecimal packingCharges;

    @Column(name = "o_delivery_fees", nullable = false)
    private BigDecimal deliveryFees;

    @Column(name = "o_taxes", nullable = false)
    private BigDecimal taxes;

    @Column(name = "o_total_amount", nullable = false)
    private BigDecimal totalAmount;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    public OrderResponseDto toResponseDto() {
        return OrderResponseDto.builder()
                .id(this.id)
                .kitchenId(this.kitchen.getId())
                .customerName(this.customerName)
                .customerPhone(this.customerPhone)
                .deliveryAddress(this.deliveryAddress)
                .status(this.status)
                .totalAmount(this.totalAmount)
                .orderItems(this.orderItems.stream()
                        .map(OrderItem::toResponseDto)
                        .toList())
                .build();
    }
}
