package com.flykraft.livemenu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("api/v1/users")
public interface UserController {

    @GetMapping
    ResponseEntity<?> getUserDetails();
}
