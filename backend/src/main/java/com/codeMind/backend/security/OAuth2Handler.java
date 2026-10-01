package com.codeMind.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.util.UUID;


@Slf4j
@Configuration
@RequiredArgsConstructor
public class OAuth2Handler {

    private final OAuthTokenStore tokenStore;

    @Value("${app.oauth-redirect-url}")
    String frontendUrl;

    private String primaryFrontendUrl() {
        if (frontendUrl == null) return "";
        String first = frontendUrl.split(",")[0].trim();
        // Strip trailing slash so we can safely append paths
        return first.endsWith("/") ? first.substring(0, first.length() - 1) : first;
    }

    @Bean
    public AuthenticationSuccessHandler oauth2SuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response, Authentication authentication) -> {

            AppUserPrincipal principal = (AppUserPrincipal) authentication.getPrincipal();
            Long githubId = principal.getUser().getGithubId();

            // Generate a 2-minute one-time handoff token
            String token = tokenStore.generate(githubId);

            String redirectUrl = primaryFrontendUrl() + "/auth/callback?token=" + token;
            response.sendRedirect(redirectUrl);
        };
    }

    @Bean
    public AuthenticationFailureHandler oauth2FailerHandler() {
        return (HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) -> {
            String requestId = UUID.randomUUID().toString().substring(0, 8);

            // Extract the specific OAuth2 error code if available
            String oauth2ErrorCode = "unknown";
            if (exception instanceof OAuth2AuthenticationException oauth2Ex) {
                oauth2ErrorCode = oauth2Ex.getError().getErrorCode();
            }

            // Map specific OAuth2 error codes to frontend-friendly error params
            String errorParam = mapErrorCode(oauth2ErrorCode, exception);
            String redirectUrl = primaryFrontendUrl() + "/login?error=" + errorParam;
            response.sendRedirect(redirectUrl);
        };
    }

    private String mapErrorCode(String oauth2ErrorCode, AuthenticationException exception) {
        if (oauth2ErrorCode == null) return "oauth2_error";

        return switch (oauth2ErrorCode) {
            case "authorization_request_not_found" -> "oauth2_state_lost";
            case "invalid_redirect_uri_parameter", "redirect_uri_mismatch" -> "oauth2_config_error";
            case "invalid_token_response", "invalid_id_token" -> "oauth2_token_error";
            case "invalid_user_info_response", "user_info_error" -> "user_info_error";
            case "access_denied" -> "access_denied";
            case "invalid_nonce" -> "oauth2_state_lost";
            case "server_error" -> "oauth2_server_error";
            default -> {
                if (exception != null && exception.getMessage() != null
                        && exception.getMessage().contains("access_denied")) {
                    yield "access_denied";
                }
                yield "oauth2_error";
            }
        };
    }
}
