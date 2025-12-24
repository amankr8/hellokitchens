package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.menu.MenuItemRequestDto;
import com.flykraft.livemenu.model.MenuItem;

import java.util.List;

public interface MenuService {

    List<MenuItem> getMenuItemsByKitchen(String kitchenSubdomain);

    MenuItem getMenuItemById(Long menuItemId);

    MenuItem addMenuItemToKitchen(Long kitchenId, MenuItemRequestDto menuItemRequestDto);

    MenuItem updateMenuItem(Long menuItemId, MenuItemRequestDto menuItemRequestDto);

    MenuItem toggleInStockForMenuItem(Long menuItemId);

    void deleteMenuItemById(Long menuItemId);
}
