package com.flykraft.livemenu.repository;

import com.flykraft.livemenu.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByPhone(String phone);
}
