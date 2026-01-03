package com.flykraft.livemenu.repository;

import com.flykraft.livemenu.entity.Kitchen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KitchenRepository extends JpaRepository<Kitchen, Long> {
    Optional<Kitchen> findBySubdomain(String subdomain);
}
