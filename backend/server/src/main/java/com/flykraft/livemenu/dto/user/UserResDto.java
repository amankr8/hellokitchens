package com.flykraft.livemenu.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class UserResDto {
    private Long id;
    private String name;
    private String phone;
    private Long defaultAddressId;
    private List<AddressResDto> addresses;
}
