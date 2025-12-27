package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.config.TenantContext;
import com.flykraft.livemenu.dto.customer.CustomerReqDto;
import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.entity.*;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
import com.flykraft.livemenu.model.OrderStatus;
import com.flykraft.livemenu.repository.OrderItemRepository;
import com.flykraft.livemenu.repository.OrderRepository;
import com.flykraft.livemenu.service.CustomerService;
import com.flykraft.livemenu.service.KitchenService;
import com.flykraft.livemenu.service.MenuService;
import com.flykraft.livemenu.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerService customerService;
    private final KitchenService kitchenService;
    private final MenuService menuService;

    @Override
    public List<Order> loadOrdersByKitchen(Long kitchenId) {
        Long currentKitchenId = TenantContext.getKitchenId();
        if (!currentKitchenId.equals(kitchenId)) {
            throw new SecurityException("Access denied to orders of kitchen id: " + kitchenId);
        }
        Kitchen kitchen = kitchenService.loadKitchenById(currentKitchenId);
        return orderRepository.findAllByKitchen(kitchen);
    }

    @Override
    public Order loadOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    @Transactional
    @Override
    public Order createOrder(OrderRequestDto orderRequestDto) {
        Kitchen kitchen = kitchenService.loadKitchenById(TenantContext.getKitchenId());

        Order order = Order.builder()
                .kitchen(kitchen)
                .status(OrderStatus.PENDING)
                .totalPrice(BigDecimal.ZERO)
                .build();
        order = orderRepository.save(order);

        CustomerReqDto customerReqDto = orderRequestDto.getCustomerDetails();
        try {
            //TODO: Add logic to verify customer by phone OTP
            Customer customer = customerService.loadCustomerByPhone(customerReqDto.getPhone());
            customer = customerService.updateCustomerDetails(customer.getId(), customerReqDto);
            order.setCustomer(customer);
        } catch (ResourceNotFoundException e) {
            Customer customer = customerService.registerCustomer(customerReqDto);
            order.setCustomer(customer);
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        for (var itemDto : orderRequestDto.getOrderItems()) {
            MenuItem menuItem = menuService.loadMenuItemById(itemDto.getMenuItemId());
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(itemDto.getQuantity())
                    .price(menuItem.getPrice())
                    .build();
            orderItems.add(orderItem);
            totalPrice = totalPrice.add(menuItem.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
        }
        orderItemRepository.saveAll(orderItems);
        order.setTotalPrice(totalPrice);
        return order;
    }

    @Override
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = loadOrderById(orderId);
        order.setStatus(OrderStatus.valueOf(status));
        return orderRepository.save(order);
    }

    @Override
    public void cancelOrder(Long orderId) {
        Order order = loadOrderById(orderId);
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
