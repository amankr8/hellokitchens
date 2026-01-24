package com.flykraft.livemenu.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusRequestDto {
    private String newStatus;
    private String trackingUrl;
}
