package com.flykraft.livemenu.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddressResDto {
    private Long id;
    private String address;
}
