package com.flykraft.livemenu.repository;

import com.flykraft.livemenu.entity.Order;
import com.flykraft.livemenu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
