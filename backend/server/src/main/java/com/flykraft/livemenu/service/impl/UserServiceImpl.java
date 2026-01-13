package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.CustomerProfile;
import com.flykraft.livemenu.entity.User;
import com.flykraft.livemenu.repository.CustomerProfileRepository;
import com.flykraft.livemenu.repository.UserRepository;
import com.flykraft.livemenu.service.UserService;
import com.flykraft.livemenu.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;

    @Override
    public User getUserDetails() {
        AuthUser authUser = AuthUtil.getLoggedInUser();
        return userRepository.findByAuthUser(authUser).orElseGet(User::new);
    }

    @Transactional
    @Override
    public User addUserDetails(UserReqDto userReqDto) {
        AuthUser authUser = AuthUtil.getLoggedInUser();
        User user = User.builder()
                .authUser(authUser)
                .name(userReqDto.getName())
                .phone(authUser.getUsername())
                .build();
        user = userRepository.save(user);
        CustomerProfile customerProfile = CustomerProfile.builder()
                .name(userReqDto.getName())
                .phone(authUser.getUsername())
                .address(userReqDto.getAddress())
                .user(user)
                .build();
        customerProfile = customerProfileRepository.save(customerProfile);
        user.setDefaultProfileId(customerProfile.getId());
        user.setCustomerProfiles(List.of(customerProfile));
        return user;
    }
}
