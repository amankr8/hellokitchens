package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.OrderController;
import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class OrderControllerImpl implements OrderController {
    private final OrderService orderService;

    @Override
    public ResponseEntity<?> createOrder(OrderRequestDto orderRequestDto) {
        return null;
    }
}
