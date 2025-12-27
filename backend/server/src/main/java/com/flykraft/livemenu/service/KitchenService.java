package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.kitchen.KitchenReqDto;
import com.flykraft.livemenu.dto.kitchen.RegisterKitchenDto;
import com.flykraft.livemenu.entity.Kitchen;
import org.springframework.security.access.prepost.PreAuthorize;

public interface KitchenService {

    Kitchen loadKitchen();

    Kitchen loadKitchenById(Long kitchenId);

    @PreAuthorize("hasAuthority('ADMIN')")
    Kitchen registerKitchen(RegisterKitchenDto registerKitchenDto);

    @PreAuthorize("hasAuthority('KITCHEN_OWNER')")
    Kitchen updateKitchenDetails(Long kitchenId, KitchenReqDto kitchenReqDto);
}
