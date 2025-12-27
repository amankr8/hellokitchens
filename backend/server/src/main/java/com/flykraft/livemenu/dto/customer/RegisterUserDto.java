package com.flykraft.livemenu.dto.customer;

import com.flykraft.livemenu.dto.auth.AuthRequestDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterUserDto {
    private AuthRequestDto credentials;
    private CustomerReqDto customerDetails;
}
