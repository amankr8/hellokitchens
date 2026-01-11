package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;

public interface UserService {
    @PreAuthorize("hasAuthority('USER')")
    User addUserDetails(UserReqDto userReqDto);
}
