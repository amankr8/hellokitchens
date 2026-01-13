package com.flykraft.livemenu.dto.order;

import com.flykraft.livemenu.dto.user.UserReqDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDto {
    private UserReqDto userDetails;
    private String specialInstructions;
    private List<OrderItemRequestDto> orderItems;
}
