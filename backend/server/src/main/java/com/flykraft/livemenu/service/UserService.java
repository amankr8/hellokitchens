package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.user.ProfileReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.CustomerProfile;
import com.flykraft.livemenu.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;

public interface UserService {
    User loadCurrentUser();

    @PreAuthorize("hasAuthority('USER')")
    User getUserDetails();

    @PreAuthorize("hasAuthority('USER')")
    User addUserDetails(UserReqDto userReqDto);

    @PreAuthorize("hasAuthority('USER')")
    CustomerProfile addProfileForUser(ProfileReqDto profileReqDto);

    CustomerProfile updateProfileForUser(Long profileId, ProfileReqDto profileReqDto);

    void deleteProfile(Long profileId);
}
