package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.menu.CategoryRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/categories")
public interface CategoryController {
    @GetMapping
    ResponseEntity<?> getAllCategories();

    @PostMapping
    ResponseEntity<?> createCategory(@RequestBody CategoryRequestDto categoryRequestDto);

    @PutMapping("/{categoryId}")
    ResponseEntity<?> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryRequestDto categoryRequestDto);

    @DeleteMapping("/{categoryId}")
    ResponseEntity<?> deleteCategory(@PathVariable Long categoryId);
}
