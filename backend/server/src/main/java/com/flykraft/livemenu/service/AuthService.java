package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.customer.RegisterUserDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.model.Authority;

public interface AuthService {

    AuthUser loadUserByUsername(String username);

    void userSignup(RegisterUserDto registerUserDto);

    AuthUser register(String username, String password, Authority authority);

    String login(String username, String password);
}
