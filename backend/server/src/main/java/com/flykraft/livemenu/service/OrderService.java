package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.entity.Order;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface OrderService {
    List<Order> loadOrdersByKitchen(Long kitchenId);

    @PreAuthorize("hasAuthority('CUSTOMER')")
    List<Order> loadOrdersByCustomer(Long customerId);

    Order loadOrderById(Long orderId);

    Order createOrder(OrderRequestDto orderRequestDto);

    Order updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId);
}
