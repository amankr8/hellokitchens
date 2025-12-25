package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/orders")
public interface OrderController {

    @PostMapping
    ResponseEntity<?> createOrder(@RequestBody OrderRequestDto orderRequestDto);

    @PatchMapping("/{orderId}/update")
    ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status);

    @DeleteMapping
    ResponseEntity<?> deleteOrder(@PathVariable Long orderId);
}
