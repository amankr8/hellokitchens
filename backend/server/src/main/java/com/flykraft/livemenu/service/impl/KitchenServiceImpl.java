package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.config.TenantContext;
import com.flykraft.livemenu.dto.kitchen.KitchenRequestDto;
import com.flykraft.livemenu.entity.Kitchen;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
import com.flykraft.livemenu.repository.KitchenRepository;
import com.flykraft.livemenu.service.KitchenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class KitchenServiceImpl implements KitchenService {

    private final KitchenRepository kitchenRepository;

    @Override
    public Kitchen getCurrentKitchen() {
        Long currentKitchenId = TenantContext.getKitchenId();
        return getKitchenById(currentKitchenId);
    }

    @Override
    public Kitchen getKitchenById(Long kitchenId) {
        return kitchenRepository.findById(kitchenId)
                .orElseThrow(() -> new ResourceNotFoundException("Kitchen with id " + kitchenId + " not found"));
    }

    @Override
    public Kitchen addKitchen(KitchenRequestDto kitchenRequestDto) {
        Kitchen kitchen = Kitchen.builder()
                .name(kitchenRequestDto.getName())
                .tagline(kitchenRequestDto.getTagline())
                .address(kitchenRequestDto.getAddress())
                .whatsapp(kitchenRequestDto.getWhatsapp())
                .subdomain(kitchenRequestDto.getSubdomain())
                .build();
        return kitchenRepository.save(kitchen);
    }

    @Override
    public Kitchen updateKitchenDetails(Long kitchenId, KitchenRequestDto kitchenRequestDto) {
        Kitchen selectedKitchen = getKitchenById(kitchenId);
        selectedKitchen.setName(kitchenRequestDto.getName());
        selectedKitchen.setTagline(kitchenRequestDto.getTagline());
        selectedKitchen.setAddress(kitchenRequestDto.getAddress());
        selectedKitchen.setWhatsapp(kitchenRequestDto.getWhatsapp());
        return kitchenRepository.save(selectedKitchen);
    }

    @Override
    public void deleteKitchenById(Long kitchenId) {
        kitchenRepository.deleteById(kitchenId);
    }
}
