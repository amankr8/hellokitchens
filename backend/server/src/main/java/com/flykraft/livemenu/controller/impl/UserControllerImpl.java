package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.UserController;
import com.flykraft.livemenu.dto.user.ProfileReqDto;
import com.flykraft.livemenu.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class UserControllerImpl implements UserController {
    private final UserService userService;

    @Override
    public ResponseEntity<?> getUserDetails() {
        return ResponseEntity.ok().body(userService.getUserDetails().toResponseDto());
    }

    @Override
    public ResponseEntity<?> addProfile(ProfileReqDto profileReqDto) {
        return ResponseEntity.ok().body(userService.addProfileForUser(profileReqDto).toResponseDto());
    }

    @Override
    public ResponseEntity<?> updateProfile(Long id, ProfileReqDto profileReqDto) {
        return ResponseEntity.ok().body(userService.updateProfileForUser(id, profileReqDto).toResponseDto());
    }

    @Override
    public ResponseEntity<?> deleteProfile(Long id) {
        userService.deleteProfile(id);
        return ResponseEntity.ok().build();
    }
}
