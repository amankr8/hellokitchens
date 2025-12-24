package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.AuthController;
import com.flykraft.livemenu.dto.auth.AuthRequestDto;
import com.flykraft.livemenu.dto.auth.AuthResponseDto;
import com.flykraft.livemenu.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class AuthControllerImpl implements AuthController {
    private final AuthService authService;

    @Override
    public ResponseEntity<?> signup(AuthRequestDto authRequestDto) {
        authService.signup(authRequestDto);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<?> login(AuthRequestDto authRequestDto) {
        AuthResponseDto authResponseDto = new AuthResponseDto();
        authResponseDto.setToken(authService.login(authRequestDto));
        return ResponseEntity.ok(authResponseDto);
    }
}
