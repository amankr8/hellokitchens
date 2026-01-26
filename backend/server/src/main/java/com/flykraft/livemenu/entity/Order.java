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

    @Column(name = "o_delivery_location", nullable = false)
    private String deliveryLocation;

    @Column(name = "o_tracking_url")
    private String trackingUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "o_status", nullable = false)
    private OrderStatus status;

    @Column(name = "o_subtotal", nullable = false)
    private BigDecimal subtotal;

    @Column(name = "o_packing_charges", nullable = false)
    private BigDecimal packingCharges = BigDecimal.ZERO;

    @Column(name = "o_delivery_fees", nullable = false)
    private BigDecimal deliveryFees = BigDecimal.ZERO;

    @Column(name = "o_taxes", nullable = false)
    private BigDecimal taxes = BigDecimal.ZERO;

    @Column(name = "o_total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "o_special_instructions")
    private String specialInstructions;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    public OrderResponseDto toResponseDto() {
        return OrderResponseDto.builder()
                .id(this.id)
                .kitchenId(this.kitchen.getId())
                .customerName(this.customerName)
                .customerPhone(this.customerPhone)
                .streetAddress(this.deliveryStreet)
                .deliveryAddress(this.deliveryAddress)
                .location(this.deliveryLocation)
                .status(this.status)
                .subtotal(this.subtotal)
                .packingCharges(this.packingCharges)
                .deliveryFees(this.deliveryFees)
                .taxes(this.taxes)
                .totalAmount(this.totalAmount)
                .notes(this.specialInstructions)
                .orderItems(this.orderItems.stream()
                        .map(OrderItem::toResponseDto)
                        .toList())
                .createdAt(this.getCreatedAt())
                .updatedAt(this.getUpdatedAt())
                .build();
    }
}
