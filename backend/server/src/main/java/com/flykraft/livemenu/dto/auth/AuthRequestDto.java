package com.flykraft.livemenu.dto.auth;

import lombok.Data;

@Data
public class AuthRequestDto {
    private String username;
    private String password;
    private Integer authId;
}
