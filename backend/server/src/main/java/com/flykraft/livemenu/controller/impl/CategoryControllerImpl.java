package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.CategoryController;
import com.flykraft.livemenu.dto.menu.CategoryRequestDto;
import com.flykraft.livemenu.entity.Category;
import com.flykraft.livemenu.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class CategoryControllerImpl implements CategoryController {
    private final CategoryService categoryService;

    @Override
    public ResponseEntity<?> getAllCategories() {
        return ResponseEntity.ok().body(categoryService.loadAllCategories()
                .stream().map(Category::toResponseDto).toList());
    }

    @Override
    public ResponseEntity<?> createCategory(CategoryRequestDto categoryRequestDto) {
        return ResponseEntity.ok().body(categoryService.addNewCategory(categoryRequestDto).toResponseDto());
    }

    @Override
    public ResponseEntity<?> updateCategory(Long categoryId, CategoryRequestDto categoryRequestDto) {
        return ResponseEntity.ok().body(categoryService.updateCategory(categoryId, categoryRequestDto).toResponseDto());
    }

    @Override
    public ResponseEntity<?> deleteCategory(Long categoryId) {
        categoryService.deleteCategoryById(categoryId);
        return ResponseEntity.ok().build();
    }
}
