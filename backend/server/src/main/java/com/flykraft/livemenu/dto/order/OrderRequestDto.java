package com.flykraft.livemenu.dto.order;

import com.flykraft.livemenu.dto.user.AddressReqDto;
import com.flykraft.livemenu.dto.user.UserReqDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDto {
    private UserReqDto customerDetails;
    private AddressReqDto addressDetails;
    private String notes;
    private List<OrderItemRequestDto> orderItems;
}
