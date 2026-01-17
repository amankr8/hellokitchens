package com.flykraft.livemenu.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressReqDto {
    private String streetAddress = "";
    private String fullAddress;
    private String location = "";
}
