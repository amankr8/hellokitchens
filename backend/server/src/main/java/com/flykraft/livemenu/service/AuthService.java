package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.auth.AuthResponseDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.model.Authority;

public interface AuthService {

    AuthUser register(String username, String password, Authority authority);

    AuthResponseDto firebaseLogin(String firebaseToken);

    AuthResponseDto login(String username, String password);
}
