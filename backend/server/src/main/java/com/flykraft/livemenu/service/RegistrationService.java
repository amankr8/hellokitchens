package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.kitchen.RegisterKitchenDto;
import com.flykraft.livemenu.entity.Kitchen;
import org.springframework.security.access.prepost.PreAuthorize;

public interface RegistrationService {

    @PreAuthorize("hasAuthority('ADMIN')")
    Kitchen registerKitchen(RegisterKitchenDto registerKitchenDto);
}
