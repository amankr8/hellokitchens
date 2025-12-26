package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.entity.Order;

public interface OrderService {
    Order loadOrderById(Long orderId);

    Order createOrder(OrderRequestDto orderRequestDto);

    Order updateOrderStatus(Long orderId, String status);

    void cancelOrder(Long orderId);
}
