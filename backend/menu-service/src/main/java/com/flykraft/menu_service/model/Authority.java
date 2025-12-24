package com.flykraft.menu_service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;

@AllArgsConstructor
public enum Authority implements GrantedAuthority {
    ADMIN(1, "Admin"),
    KITCHEN_OWNER(2, "Kitchen Owner"),
    CUSTOMER(3, "Customer");

    @Getter
    private final Integer id;
    private final String authority;

    @Override
    public @NonNull String getAuthority() {
        return authority;
    }
}
