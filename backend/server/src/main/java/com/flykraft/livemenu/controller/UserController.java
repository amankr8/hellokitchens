package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.user.AddressReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/users")
public interface UserController {

    @GetMapping
    ResponseEntity<?> getUserDetails();

    @PostMapping
    ResponseEntity<?> addUser(@RequestBody UserReqDto userReqDto);

    @PutMapping
    ResponseEntity<?> updateUser(@RequestBody UserReqDto userReqDto);

    @DeleteMapping
    ResponseEntity<?> deleteUser();

    @PostMapping("/addresses")
    ResponseEntity<?> addAddress(@RequestBody AddressReqDto addressReqDto);

    @PutMapping("/addresses/{id}")
    ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody AddressReqDto addressReqDto);

    @DeleteMapping("/addresses/{id}")
    ResponseEntity<?> deleteAddress(@PathVariable Long id);
}
