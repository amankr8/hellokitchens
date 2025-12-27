package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.auth.AuthRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/v1/auth")
public interface AuthController {

    @PostMapping("/login")
    ResponseEntity<?> login(@RequestBody AuthRequestDto authRequestDto);
}
