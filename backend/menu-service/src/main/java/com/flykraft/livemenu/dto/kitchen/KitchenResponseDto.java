package com.flykraft.livemenu.dto.kitchen;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KitchenResponseDto {
    private Long id;
    private String name;
    private String tagline;
    private String subdomain;
    private String address;
    private String whatsapp;
}
