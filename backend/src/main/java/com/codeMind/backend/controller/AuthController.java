package com.codeMind.backend.controller;

import com.codeMind.backend.dto.response.UserResponse;
import com.codeMind.backend.entity.RefreshToken;
import com.codeMind.backend.entity.User;
import com.codeMind.backend.repository.RefreshTokenRepository;
import com.codeMind.backend.repository.UserRepository;
import com.codeMind.backend.security.AppUserPrincipal;
import com.codeMind.backend.security.CurrentUser;
import com.codeMind.backend.security.JwtService;
import com.codeMind.backend.security.OAuthTokenStore;
import com.codeMind.backend.util.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CurrentUser currentUser;
    private final OAuthTokenStore tokenStore;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final SessionUtil sessionUtil;

    @GetMapping("/login-url")
    public ResponseEntity<Map<String, String>> loginUrl() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("url", "/oauth2/authorization/github"));
    }

    @PostMapping("/exchange")
    @Transactional
    public ResponseEntity<UserResponse> exchangeToken(@RequestParam String token, HttpServletRequest request, HttpServletResponse response) {

        Long githubId = tokenStore.consume(token);
        if (githubId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOpt = userRepository.findByGithubId(githubId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOpt.get();

        String accessToken = jwtService.generateAccessToken(githubId);
        String opaqueRefreshToken = jwtService.generateOpaqueRefreshToken();
        String tokenHash = jwtService.hashToken(opaqueRefreshToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .tokenHash(tokenHash)
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        sessionUtil.setAccessTokenCookie(request, response, accessToken);
        sessionUtil.setRefreshTokenCookie(request, response, opaqueRefreshToken);
        sessionUtil.setSessionCookie(request, response);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getGithubId(),
                user.getGithubUsername(),
                user.getDisplayName(),
                user.getAvatarUrl()
        );

        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/refresh")
    @Transactional
    public ResponseEntity<UserResponse> refresh(
            @CookieValue(name = "codemind_refresh_token", required = false) String opaqueRefreshToken, HttpServletRequest request,
            HttpServletResponse response) {

        if (opaqueRefreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String tokenHash = jwtService.hashToken(opaqueRefreshToken);
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepository.findByTokenHash(tokenHash);

        if (refreshTokenOpt.isEmpty()) {
            sessionUtil.clearCookies(request, response);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        RefreshToken refreshToken = refreshTokenOpt.get();
        User user = refreshToken.getUser();

        if (refreshToken.isRevoked()) {
            boolean recentRotation = refreshTokenRepository.existsByUserAndRevokedFalseAndCreatedAtAfter(
                    user, Instant.now().minusSeconds(30)
            );

            if (recentRotation) {
                String newAccessToken = jwtService.generateAccessToken(user.getGithubId());
                sessionUtil.setAccessTokenCookie(request, response, newAccessToken);

                UserResponse userResponse = new UserResponse(
                        user.getId(),
                        user.getGithubId(),
                        user.getGithubUsername(),
                        user.getDisplayName(),
                        user.getAvatarUrl()
                );
                return ResponseEntity.ok(userResponse);
            }

            // Reuse detected! Revoke all tokens for this user.
            refreshTokenRepository.revokeAllUserTokens(user);
            sessionUtil.clearCookies(request, response);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            sessionUtil.clearCookies(request, response);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Token is valid. Rotate it.
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        String newOpaqueRefreshToken = jwtService.generateOpaqueRefreshToken();
        String newTokenHash = jwtService.hashToken(newOpaqueRefreshToken);

        RefreshToken newRefreshToken = RefreshToken.builder()
                .tokenHash(newTokenHash)
                .user(user)
                .expiryDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newRefreshToken);

        String newAccessToken = jwtService.generateAccessToken(user.getGithubId());

        sessionUtil.setAccessTokenCookie(request, response, newAccessToken);
        sessionUtil.setRefreshTokenCookie(request, response, newOpaqueRefreshToken);
        sessionUtil.setSessionCookie(request, response);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getGithubId(),
                user.getGithubUsername(),
                user.getDisplayName(),
                user.getAvatarUrl()
        );

        return ResponseEntity.ok(userResponse);
    }


    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {

        AppUserPrincipal principal = currentUser.require();
        User user = principal.getUser();

        return ResponseEntity.status(HttpStatus.OK)
                .body(new UserResponse(
                        user.getId(),
                        user.getGithubId(),
                        user.getGithubUsername(),
                        user.getDisplayName(),
                        user.getAvatarUrl()
                ));
    }


    @PostMapping("/logout")
    @Transactional
    public ResponseEntity<Void> logout(
            @CookieValue(name = "codemind_refresh_token", required = false) String opaqueRefreshToken,
            HttpServletRequest request, HttpServletResponse response) {

        SecurityContextHolder.clearContext();

        if (opaqueRefreshToken != null && !opaqueRefreshToken.isEmpty()) {
            String tokenHash = jwtService.hashToken(opaqueRefreshToken);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(refreshTokenRepository::delete);
        }

        sessionUtil.clearCookies(request, response);
        response.setHeader("Clear-Site-Data", "\"cookies\"");

        return ResponseEntity.noContent().build();
    }
}