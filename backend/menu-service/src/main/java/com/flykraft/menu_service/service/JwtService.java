package com.flykraft.menu_service.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;

public interface JwtService {

    String extractUsername(String token);

    String generateToken(String username);

    String generateToken(Map<String, Object> extraClaims, String username);

    Long getExpirationTime();

    Boolean isTokenValid(String token, UserDetails userDetails);
}
