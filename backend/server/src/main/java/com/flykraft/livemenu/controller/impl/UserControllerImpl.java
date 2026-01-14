package com.flykraft.livemenu.controller.impl;

import com.flykraft.livemenu.controller.UserController;
import com.flykraft.livemenu.dto.user.AddressReqDto;
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
    public ResponseEntity<?> addAddress(AddressReqDto addressReqDto) {
        return ResponseEntity.ok().body(userService.addAddressForUser(addressReqDto).toResponseDto());
    }

    @Override
    public ResponseEntity<?> updateAddress(Long id, AddressReqDto addressReqDto) {
        return ResponseEntity.ok().body(userService.updateAddressForUser(id, addressReqDto).toResponseDto());
    }

    @Override
    public ResponseEntity<?> deleteAddress(Long id) {
        userService.deleteAddressForUser(id);
        return ResponseEntity.ok().build();
    }
}
