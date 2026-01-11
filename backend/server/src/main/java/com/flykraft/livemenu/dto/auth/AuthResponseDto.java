package com.flykraft.livemenu.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthResponseDto {
    private Boolean isNew;
    private String token;
}
