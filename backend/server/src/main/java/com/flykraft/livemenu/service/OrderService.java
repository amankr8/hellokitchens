package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.entity.Order;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface OrderService {

    Order loadOrderById(Long orderId);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    List<Order> loadAllOrders();

    @PreAuthorize("hasAuthority('USER')")
    Order createOrder(OrderRequestDto orderRequestDto);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    Order updateOrderStatus(Long orderId, String newStatus);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    void cancelOrder(Long orderId);
}
