package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.order.OrderRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/orders")
public interface OrderController {

    @GetMapping("/kitchen/{kitchenId}")
    ResponseEntity<?> getOrdersByKitchen(@PathVariable Long kitchenId);

    @GetMapping("/customer/{customerId}")
    ResponseEntity<?> getOrdersByCustomer(@PathVariable Long customerId);

    @PostMapping
    ResponseEntity<?> createOrder(@RequestBody OrderRequestDto orderRequestDto);

    @PatchMapping("/{orderId}/update")
    ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status);

    @DeleteMapping
    ResponseEntity<?> cancelOrder(@PathVariable Long orderId);
}
