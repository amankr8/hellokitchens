package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.AuthController;
import com.flykraft.livemenu.dto.auth.AuthRequestDto;
import com.flykraft.livemenu.dto.auth.AuthResponseDto;
import com.flykraft.livemenu.service.AuthService;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class AuthControllerImpl implements AuthController {
    private final AuthService authService;

    @Override
    public ResponseEntity<?> phoneLogin(String firebaseToken) {
        return ResponseEntity.ok(authService.firebaseLogin(firebaseToken));
    }

    @Override
    public ResponseEntity<?> login(AuthRequestDto authRequestDto) {
        return ResponseEntity.ok(authService.login(authRequestDto.getUsername(), authRequestDto.getPassword()));
    }
}
