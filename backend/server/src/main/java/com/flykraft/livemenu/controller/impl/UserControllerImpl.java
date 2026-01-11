package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.UserController;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @Override
    public ResponseEntity<?> addUser(UserReqDto userReqDto) {
        return ResponseEntity.ok().body(userService.addUserDetails(userReqDto));
    }
}
