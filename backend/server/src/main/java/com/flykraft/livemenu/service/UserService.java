package com.flykraft.livemenu.service;

import com.flykraft.livemenu.dto.user.AddressReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.Address;
import com.flykraft.livemenu.entity.User;
import org.springframework.security.access.prepost.PreAuthorize;

public interface UserService {

    @PreAuthorize("hasAuthority('USER')")
    User loadCurrentUser();

    @PreAuthorize("hasAuthority('USER')")
    User addUser(UserReqDto userReqDto);

    @PreAuthorize("hasAuthority('USER')")
    Address addAddressForUser(AddressReqDto addressReqDto);

    Address updateAddressForUser(Long profileId, AddressReqDto addressReqDto);

    void deleteAddressForUser(Long addressId);
}
