package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.user.ProfileReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.CustomerProfile;
import com.flykraft.livemenu.entity.User;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
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
    public User loadCurrentUser() {
        AuthUser authUser = AuthUtil.getLoggedInUser();
        return userRepository.findByAuthUser(authUser)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User getUserDetails() {
        try {
            return loadCurrentUser();
        } catch (ResourceNotFoundException e) {
            return new User();
        }
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

    @Transactional
    @Override
    public CustomerProfile addProfileForUser(ProfileReqDto profileReqDto) {
        User user = loadCurrentUser();
        CustomerProfile customerProfile = new CustomerProfile();
        customerProfile.setUser(user);
        if (profileReqDto.getName() == null || profileReqDto.getName().isEmpty()) {
            customerProfile.setName(user.getName());
        } else {
            customerProfile.setName(profileReqDto.getName());
        }
        if (profileReqDto.getPhone() == null || profileReqDto.getPhone().isEmpty()) {
            customerProfile.setPhone(user.getPhone());
        } else {
            customerProfile.setPhone(profileReqDto.getPhone());
        }
        customerProfile.setAddress(profileReqDto.getAddress());
        return customerProfileRepository.save(customerProfile);
    }

    @Override
    public CustomerProfile updateProfileForUser(Long profileId, ProfileReqDto profileReqDto) {
        CustomerProfile selectedProfile = customerProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer Profile with id " + profileId + " not found"));

        selectedProfile.setName(profileReqDto.getName());
        selectedProfile.setPhone(profileReqDto.getPhone());
        selectedProfile.setAddress(profileReqDto.getAddress());

        return customerProfileRepository.save(selectedProfile);
    }

    @Override
    public void deleteProfile(Long profileId) {
        customerProfileRepository.deleteById(profileId);
    }
}
