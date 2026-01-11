package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.user.UserReqDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("api/v1/users")
public interface UserController {

    @PostMapping
    ResponseEntity<?> addUser(@RequestBody UserReqDto userReqDto);
}
