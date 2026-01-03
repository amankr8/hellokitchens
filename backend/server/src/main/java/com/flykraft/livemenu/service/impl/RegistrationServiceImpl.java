package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.auth.AuthRequestDto;
import com.flykraft.livemenu.dto.kitchen.RegisterKitchenDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.Kitchen;
import com.flykraft.livemenu.entity.KitchenOwner;
import com.flykraft.livemenu.model.Authority;
import com.flykraft.livemenu.model.KitchenRole;
import com.flykraft.livemenu.repository.KitchenOwnerRepository;
import com.flykraft.livemenu.service.AuthService;
import com.flykraft.livemenu.service.KitchenService;
import com.flykraft.livemenu.service.RegistrationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RegistrationServiceImpl implements RegistrationService {
    private final AuthService authService;
    private final KitchenService kitchenService;
    private final KitchenOwnerRepository kitchenOwnerRepository;

    @Transactional
    @Override
    public Kitchen registerKitchen(RegisterKitchenDto registerKitchenDto) {
        AuthRequestDto authRequestDto = registerKitchenDto.getCredentials();
        AuthUser authUser = authService.register(
                authRequestDto.getUsername(),
                authRequestDto.getPassword(),
                Authority.KITCHEN_OWNER
        );
        Kitchen kitchen = kitchenService.addKitchen(registerKitchenDto.getKitchenDetails());
        KitchenOwner kitchenOwner = KitchenOwner.builder()
                .authUser(authUser)
                .kitchen(kitchen)
                .role(KitchenRole.ADMIN)
                .build();
        kitchenOwnerRepository.save(kitchenOwner);
        return kitchen;
    }

}
