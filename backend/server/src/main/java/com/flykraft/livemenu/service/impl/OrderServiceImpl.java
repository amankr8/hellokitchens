package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.entity.Order;
import com.flykraft.livemenu.repository.OrderRepository;
import com.flykraft.livemenu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    @Override
    public Order createOrder(OrderRequestDto orderRequestDto) {
        return null;
    }
}
