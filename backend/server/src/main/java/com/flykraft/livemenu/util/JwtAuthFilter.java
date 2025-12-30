package com.flykraft.livemenu.util;

import com.flykraft.livemenu.config.TenantContext;
import com.flykraft.livemenu.entity.Kitchen;
import com.flykraft.livemenu.repository.KitchenRepository;
import com.flykraft.livemenu.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final KitchenRepository kitchenRepository; // Inject this to resolve subdomain

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        // 1. Resolve Kitchen ID from Subdomain/Host first (Applies to everyone, even guests)
        String host = request.getHeader("Host");
        Long resolvedKitchenId = null;
        if (host != null) {
            String subdomain = host.split("\\.")[0];
            // Tip: Cache this lookup or use a simple Map to avoid DB hits on every filter call
            resolvedKitchenId = kitchenRepository.findBySubdomain(subdomain)
                    .map(Kitchen::getId)
                    .orElse(null);
        }

        String authHeader = request.getHeader("Authorization");

        // Handle Guest/Public access
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

            // 2. SECURITY CHECK: Mismatch Validation
            // If the user is logged into a specific kitchen (Admin/Staff),
            // but tries to access a different subdomain, block it.
            if (kitchenIdFromJwt != null && resolvedKitchenId != null
                    && !kitchenIdFromJwt.equals(resolvedKitchenId)) {

                response.setStatus(HttpStatus.FORBIDDEN.value());
                response.getWriter().write("Access Denied: You are not authorized for this kitchen.");
                return;
            }

            // 3. Set the Context (Use the resolved one for consistency)
            if (resolvedKitchenId != null) {
                TenantContext.setKitchenId(resolvedKitchenId);
            }

            // Standard Auth Logic
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

        } catch (Exception e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Authentication failed.");
        } finally {
            TenantContext.clear();
        }
    }
}
