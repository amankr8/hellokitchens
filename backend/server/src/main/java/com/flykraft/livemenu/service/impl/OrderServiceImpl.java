package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.config.TenantContext;
import com.flykraft.livemenu.dto.order.OrderRequestDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.*;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
import com.flykraft.livemenu.model.OrderStatus;
import com.flykraft.livemenu.repository.UserRepository;
import com.flykraft.livemenu.repository.OrderItemRepository;
import com.flykraft.livemenu.repository.OrderRepository;
import com.flykraft.livemenu.service.KitchenService;
import com.flykraft.livemenu.service.MenuService;
import com.flykraft.livemenu.service.OrderService;
import com.flykraft.livemenu.service.UserService;
import com.flykraft.livemenu.util.AuthUtil;
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
    private final UserRepository userRepository;
    private final KitchenService kitchenService;
    private final MenuService menuService;
    private final UserService userService;

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
        AuthUser authUser = AuthUtil.getLoggedInUser();

        UserReqDto userReqDto = orderRequestDto.getCustomerDetails();
        if (userReqDto.getPhone() == null || userReqDto.getPhone().isEmpty()) {
            userReqDto.setPhone(authUser.getUsername());
        }

        User user = userRepository.findByAuthUser(authUser)
                .orElseGet(() -> userService.addUserDetails(userReqDto));

        Order order = Order.builder()
                .kitchen(kitchen)
                .user(user)
                .customerName(userReqDto.getName())
                .customerPhone(userReqDto.getPhone())
                .deliveryStreet("")
                .deliveryAddress(userReqDto.getAddress())
                .deliveryPluscode("")
                .status(OrderStatus.PENDING)
                .subtotal(BigDecimal.ZERO)
                .packingCharges(BigDecimal.valueOf(15))
                .deliveryFees(BigDecimal.valueOf(40))
                .taxes(BigDecimal.ZERO)
                .totalAmount(BigDecimal.ZERO)
                .specialInstructions(orderRequestDto.getSpecialInstructions())
                .build();
        order = orderRepository.save(order);

        BigDecimal subTotal = BigDecimal.ZERO;
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
            subTotal = subTotal.add(menuItem.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())));
        }
        orderItemRepository.saveAll(orderItems);
        order.setOrderItems(orderItems);
        order.setSubtotal(subTotal);
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
