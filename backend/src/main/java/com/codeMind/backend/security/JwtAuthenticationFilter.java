package com.codeMind.backend.security;

import com.codeMind.backend.entity.User;
import com.codeMind.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String jwt = null;
        final String githubIdStr;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("codemind_access_token".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            githubIdStr = jwtService.extractGithubId(jwt);
            if (githubIdStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Long githubId = Long.parseLong(githubIdStr);
                Optional<User> userOpt = userRepository.findByGithubId(githubId);
                
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    if (jwtService.isTokenValid(jwt, githubId)) {
                        String rolesStr = jwtService.extractClaim(jwt, claims -> claims.get("roles", String.class));
                        java.util.List<org.springframework.security.core.GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(rolesStr != null ? rolesStr : "ROLE_USER");
                        AppUserPrincipal principal = new AppUserPrincipal(user, Map.of(), authorities);
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                authorities
                        );
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Token is invalid, expired, or malformed
            // Just let it proceed as unauthenticated
            logger.warn("JWT validation failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilterAsyncDispatch() {
        return false;
    }

    @Override
    protected boolean shouldNotFilterErrorDispatch() {
        return false;
    }
}
