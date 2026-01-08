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
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final KitchenService kitchenService;
    private final ObjectMapper objectMapper;

    private static final List<RequestMatcher> PUBLIC_MATCHERS = List.of(
            PathPatternRequestMatcher.withDefaults().matcher("/api/v1/auth/**"),
            PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.GET, "/api/v1/menus/**"),
            PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.GET, "/api/v1/kitchens/**"),
            PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.POST, "/api/v1/orders/**")
    );


    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        return PUBLIC_MATCHERS
                .stream()
                .anyMatch(matcher -> matcher.matches(request));
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            Long resolvedKitchenId = null;
            String origin = request.getHeader("Origin");
            if (origin != null) {
                String cleanOrigin = origin.replaceFirst("^https?://", "");
                String subdomain = cleanOrigin.split("\\.")[0];
                Kitchen kitchen = kitchenService.loadKitchenBySubdomain(subdomain);
                resolvedKitchenId = kitchen.getId();
                TenantContext.setKitchenId(resolvedKitchenId);
            }

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String jwtToken = authHeader.substring(7);
            String username = jwtService.extractUsername(jwtToken);
            Long kitchenIdFromJwt = jwtService.extractKitchenId(jwtToken);

            if (kitchenIdFromJwt != null && resolvedKitchenId != null
                    && !kitchenIdFromJwt.equals(resolvedKitchenId)) {
                throw new SecurityException("You are not authorized for this kitchen");
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(jwtToken, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (ResourceNotFoundException e) {
            response.setStatus(HttpStatus.NOT_FOUND.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(
                    response.getWriter(),
                    new ErrorResponseDto(HttpStatus.NOT_FOUND.value(), e.getMessage())
            );
        } catch (JwtException | SecurityException e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(
                    response.getWriter(),
                    new ErrorResponseDto(HttpStatus.UNAUTHORIZED.value(), e.getMessage())
            );
        } finally {
            TenantContext.clear();
        }
    }
}

