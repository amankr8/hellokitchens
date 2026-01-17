package com.flykraft.livemenu.service.impl;

import com.flykraft.livemenu.dto.user.AddressReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import com.flykraft.livemenu.entity.AuthUser;
import com.flykraft.livemenu.entity.Address;
import com.flykraft.livemenu.entity.User;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
import com.flykraft.livemenu.repository.AddressRepository;
import com.flykraft.livemenu.repository.UserRepository;
import com.flykraft.livemenu.service.UserService;
import com.flykraft.livemenu.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    @Override
    public User loadCurrentUser() {
        AuthUser authUser = AuthUtil.getLoggedInUser();
        return userRepository.findByAuthUser(authUser)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    @Override
    public User addUser(UserReqDto userReqDto) {
        AuthUser authUser = AuthUtil.getLoggedInUser();
        User user = User.builder()
                .authUser(authUser)
                .name(userReqDto.getName())
                .phone(authUser.getUsername())
                .build();
        user = userRepository.save(user);
        return user;
    }

    @Transactional
    @Override
    public Address addAddressForUser(AddressReqDto addressReqDto) {
        User user = loadCurrentUser();
        Address address = new Address();
        address.setUser(user);
        address.setAddress(addressReqDto.getAddress());
        address = addressRepository.save(address);
        if (user.getDefaultAddressId() == null) {
            user.setDefaultAddressId(address.getId());
        }
        return address;
    }

    @Override
    public Address updateAddressForUser(Long profileId, AddressReqDto addressReqDto) {
        Address selectedProfile = addressRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer Profile with id " + profileId + " not found"));
        selectedProfile.setAddress(addressReqDto.getAddress());
        return addressRepository.save(selectedProfile);
    }

    @Override
    public void deleteAddressForUser(Long addressId) {
        User user = loadCurrentUser();
        if (user.getDefaultAddressId().equals(addressId)) {
            throw new IllegalArgumentException("Default customer profile cannot be deleted");
        }
        addressRepository.deleteById(addressId);
    }
}
