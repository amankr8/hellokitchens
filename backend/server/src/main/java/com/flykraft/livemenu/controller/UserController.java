package com.flykraft.livemenu.controller;

import com.flykraft.livemenu.dto.user.ProfileReqDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("api/v1/users")
public interface UserController {

    @GetMapping
    ResponseEntity<?> getUserDetails();

    @PostMapping("/profiles")
    ResponseEntity<?> addProfile(@RequestBody ProfileReqDto profileReqDto);

    @PutMapping("/profiles/{id}")
    ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody ProfileReqDto profileReqDto);

    @DeleteMapping("/profiles/{id}")
    ResponseEntity<?> deleteProfile(@PathVariable Long id);
}
