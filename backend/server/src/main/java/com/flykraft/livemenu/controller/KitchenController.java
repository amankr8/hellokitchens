package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.kitchen.KitchenRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/kitchens")
public interface KitchenController {

    @GetMapping
    ResponseEntity<?> getCurrentKitchen();

    @PostMapping
    ResponseEntity<?> addKitchen(@RequestBody KitchenRequestDto kitchenRequestDto);

    @PutMapping("/{kitchenId}")
    ResponseEntity<?> updateKitchenDetails(@PathVariable Long kitchenId, @RequestBody KitchenRequestDto kitchenRequestDto);

    @DeleteMapping("/{kitchenId}")
    ResponseEntity<?> deleteKitchenById(@PathVariable Long kitchenId);
}
