package com.flykraft.livemenu.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flykraft.livemenu.config.TenantContext;
import com.flykraft.livemenu.dto.ErrorResponseDto;
import com.flykraft.livemenu.entity.Kitchen;
import com.flykraft.livemenu.exception.ResourceNotFoundException;
import com.flykraft.livemenu.service.JwtService;
import com.flykraft.livemenu.service.KitchenService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final KitchenService kitchenService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String origin = request.getHeader("Origin");

        Long resolvedKitchenId = null;
        if (origin != null) {
            String cleanOrigin = origin.replaceFirst("^https?://", "");
            String subdomain = cleanOrigin.split("\\.")[0];
            try {
                Kitchen kitchen = kitchenService.loadKitchenBySubdomain(subdomain);
                resolvedKitchenId = kitchen.getId();
            } catch (ResourceNotFoundException e) {
                String errorMsg = "Authentication failed: " + e.getMessage();
                response.setStatus(HttpStatus.NOT_FOUND.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                ErrorResponseDto errorResponseDto = new ErrorResponseDto(HttpStatus.NOT_FOUND.value(), errorMsg);
                objectMapper.writeValue(response.getWriter(), errorResponseDto);
            }
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            if (resolvedKitchenId != null) {
                TenantContext.setKitchenId(resolvedKitchenId);
            }
            try {
                filterChain.doFilter(request, response);
            } finally {
                TenantContext.clear();
            }
            return;
        }

        try {
            String jwtToken = authHeader.substring(7);
            String username = jwtService.extractUsername(jwtToken);
            Long kitchenIdFromJwt = jwtService.extractKitchenId(jwtToken);

            if (kitchenIdFromJwt != null && resolvedKitchenId != null && !kitchenIdFromJwt.equals(resolvedKitchenId)) {
                throw new SecurityException("You are not authorized for this kitchen");
            }

            if (resolvedKitchenId != null) {
                TenantContext.setKitchenId(resolvedKitchenId);
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);
        } catch (JwtException e) {
            String errorMsg = "Authentication failed: " + e.getMessage();
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ErrorResponseDto errorResponseDto = new ErrorResponseDto(HttpStatus.UNAUTHORIZED.value(), errorMsg);
            objectMapper.writeValue(response.getWriter(), errorResponseDto);
        } finally {
            TenantContext.clear();
        }
    }
}
