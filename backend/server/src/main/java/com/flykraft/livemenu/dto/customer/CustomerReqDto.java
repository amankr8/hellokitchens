package com.flykraft.livemenu.dto.customer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerReqDto {
    private String name;
    private String email;
    private String phone;
    private String address;
}
