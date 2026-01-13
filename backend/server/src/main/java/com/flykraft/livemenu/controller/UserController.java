package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.user.ProfileReqDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("api/v1/users")
public interface UserController {

    @GetMapping
    ResponseEntity<?> getUserDetails();

    @PostMapping("/profiles")
    ResponseEntity<?> addProfileForUser(@RequestBody ProfileReqDto profileReqDto);
}
