package com.flykraft.livemenu.repository;

import com.flykraft.livemenu.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
