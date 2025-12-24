package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.kitchen.KitchenRequestDto;
import com.flykraft.livemenu.entity.Kitchen;

public interface KitchenService {

    Kitchen getKitchenById(Long kitchenId);

    Kitchen getKitchenBySubdomain(String kitchenSubdomain);

    Kitchen addKitchen(KitchenRequestDto kitchenRequestDto);

    Kitchen updateKitchenSubdomain(Long kitchenId, String kitchenSubdomain);

    Kitchen updateKitchenDetails(Long kitchenId, KitchenRequestDto kitchenRequestDto);

    void deleteKitchenById(Long kitchenId);
}
