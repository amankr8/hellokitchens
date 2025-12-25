package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.entity.Order;

public interface OrderService {
    Order createOrder(OrderRequestDto orderRequestDto);

    Order updateOrderStatus(Long orderId, String status);

    void deleteOrder(Long orderId);
}
