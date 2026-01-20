package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.user.AddressReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.Address;
import com.flykraft.livemenu.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {

    @PreAuthorize("hasAuthority('USER')")
    User loadCurrentUser();

    @PreAuthorize("hasAuthority('USER')")
    User addUser(UserReqDto userReqDto);

    @PreAuthorize("hasAuthority('USER')")
    User updateUser(UserReqDto userReqDto);

    @PreAuthorize("hasAuthority('USER')")
    void deleteUser();

    @PreAuthorize("hasAuthority('USER')")
    Address addAddressForUser(AddressReqDto addressReqDto);

    @PreAuthorize("hasAuthority('USER')")
    Address updateAddressForUser(Long profileId, AddressReqDto addressReqDto);

    @PreAuthorize("hasAuthority('USER')")
    void deleteAddressForUser(Long addressId);
}
