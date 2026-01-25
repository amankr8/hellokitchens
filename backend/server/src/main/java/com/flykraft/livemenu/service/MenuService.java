package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.menu.CategoryRequestDto;
import com.flykraft.livemenu.dto.menu.MenuItemRequestDto;
import com.flykraft.livemenu.entity.Category;
import com.flykraft.livemenu.entity.MenuItem;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface MenuService {
    List<Category> loadAllCategories();

    Category addNewCategory(CategoryRequestDto categoryRequestDto);

    Category updateCategory(Long categoryId, CategoryRequestDto categoryRequestDto);

    void deleteCategoryById(Long categoryId);

    List<MenuItem> loadAllMenuItems();

    MenuItem loadMenuItemById(Long menuItemId);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    MenuItem addMenuItem(MenuItemRequestDto menuItemRequestDto);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    MenuItem updateMenuItem(Long menuItemId, MenuItemRequestDto menuItemRequestDto);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    MenuItem toggleInStockForMenuItem(Long menuItemId);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    void deleteMenuItemById(Long menuItemId);
}
