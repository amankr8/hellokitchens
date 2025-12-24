package com.flykraft.menu_service.dto.kitchen;

import lombok.Data;

@Data
public class KitchenRequestDto {
    private String name;
    private String tagline;
    private String subdomain;
    private String address;
    private String whatsapp;
}
