package com.flykraft.livemenu.service;

import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.model.Authority;

public interface AuthService {

    AuthUser register(String username, String password, Authority authority);

    String firebaseLogin(String firebaseToken);

    String login(String username, String password);
}
