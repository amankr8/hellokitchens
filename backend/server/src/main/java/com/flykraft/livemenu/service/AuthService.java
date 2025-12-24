package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.auth.AuthRequestDto;

public interface AuthService {

    void signup(AuthRequestDto authRequestDto);

    String login(AuthRequestDto authRequestDto);
}
