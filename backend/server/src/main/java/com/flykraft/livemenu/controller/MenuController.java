package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.menu.CategoryRequestDto;
import com.flykraft.livemenu.dto.menu.MenuItemRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/menu")
public interface MenuController {

    @GetMapping("/categories")
    ResponseEntity<?> getAllCategories();

    @PostMapping("/categories")
    ResponseEntity<?> createCategory(@RequestBody CategoryRequestDto categoryRequestDto);

    @PutMapping("/categories/{categoryId}")
    ResponseEntity<?> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryRequestDto categoryRequestDto);

    @DeleteMapping("/categories/{categoryId}")
    ResponseEntity<?> deleteCategory(@PathVariable Long categoryId);

    @GetMapping
    ResponseEntity<?> getMenu();

    @PostMapping
    ResponseEntity<?> addMenuItem(@ModelAttribute MenuItemRequestDto menuItemRequestDto);

    @PutMapping("/{menuItemId}")
    ResponseEntity<?> updateMenuItem(@PathVariable Long menuItemId, @ModelAttribute MenuItemRequestDto menuItemRequestDto);

    @PatchMapping("/{menuItemId}")
    ResponseEntity<?> toggleInStockForMenuItem(@PathVariable Long menuItemId);

    @DeleteMapping("/{menuItemId}")
    ResponseEntity<?> deleteMenuItem(@PathVariable Long menuItemId);
}
