package com.codeMind.backend.security;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@Slf4j
@Component
public class HttpCookieOAuth2AuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    public static final String OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME = "oauth2_auth_request";
    private static final int COOKIE_EXPIRE_SECONDS = 180; // 3 minutes
    private static final int MAX_COOKIE_SIZE = 3800; // Safe limit (browsers cap at 4096)

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static final class CompactAuthRequest {
        @JsonProperty("u")
        String authorizationUri;
        @JsonProperty("g")
        String grantType;
        @JsonProperty("c")
        String clientId;
        @JsonProperty("r")
        String redirectUri;
        @JsonProperty("sc")
        Set<String> scopes;
        @JsonProperty("st")
        String state;
        @JsonProperty("ap")
        Map<String, Object> additionalParameters;
        @JsonProperty("ru")
        String authorizationRequestUri;
        @JsonProperty("at")
        Map<String, Object> attributes;

        @JsonCreator
        CompactAuthRequest() {
        }

        CompactAuthRequest(OAuth2AuthorizationRequest req) {
            this.authorizationUri = req.getAuthorizationUri();
            this.grantType = req.getGrantType() != null ? req.getGrantType().getValue() : null;
            this.clientId = req.getClientId();
            this.redirectUri = req.getRedirectUri();
            this.scopes = req.getScopes();
            this.state = req.getState();
            this.additionalParameters = req.getAdditionalParameters();
            this.authorizationRequestUri = req.getAuthorizationRequestUri();
            this.attributes = req.getAttributes();
        }

        OAuth2AuthorizationRequest toAuthorizationRequest() {
            OAuth2AuthorizationRequest.Builder builder = OAuth2AuthorizationRequest
                    .authorizationCode()
                    .authorizationUri(authorizationUri)
                    .clientId(clientId)
                    .state(state);

            if (redirectUri != null) builder.redirectUri(redirectUri);
            if (scopes != null && !scopes.isEmpty()) builder.scope(scopes.toArray(new String[0]));
            if (additionalParameters != null) builder.additionalParameters(additionalParameters);
            if (authorizationRequestUri != null) builder.authorizationRequestUri(authorizationRequestUri);
            if (attributes != null) builder.attributes(attrs -> attrs.putAll(attributes));

            return builder.build();
        }
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return fetchCookie(request, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME)
                .map(cookie -> {
                    OAuth2AuthorizationRequest authRequest = deserialize(cookie.getValue());
                    if (authRequest == null) {
                        log.warn("Failed to deserialize OAuth2 authorization request cookie (value length={})", cookie.getValue().length());
                    } else {
                        log.debug("Successfully loaded OAuth2 authorization request from cookie (state={})", authRequest.getState());
                    }
                    return authRequest;
                })
                .orElseGet(() -> {
                    log.warn("No oauth2_auth_request cookie found on callback request — possible causes: "
                            + "cookie exceeded browser size limit, SameSite/Secure mismatch, or cookie expired");
                    return null;
                });
    }

    @Override
    public void saveAuthorizationRequest(@NonNull OAuth2AuthorizationRequest authorizationRequest, @NonNull HttpServletRequest request, @NonNull HttpServletResponse response) {
        String serialized = serialize(authorizationRequest);

        if (serialized.length() > MAX_COOKIE_SIZE) {
            log.error("OAuth2 authorization request cookie too large ({} chars > {} limit). "
                    + "This WILL cause authorization_request_not_found on callback. "
                    + "State={}", serialized.length(), MAX_COOKIE_SIZE, authorizationRequest.getState());
        } else {
            log.debug("OAuth2 authorization request cookie size: {} chars (state={})", serialized.length(), authorizationRequest.getState());
        }

        Cookie cookie = new Cookie(OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME, serialized);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(COOKIE_EXPIRE_SECONDS);

        boolean isSecure = isSecureRequest(request);
        cookie.setSecure(isSecure);
        cookie.setAttribute("SameSite", isSecure ? "None" : "Lax");

        response.addCookie(cookie);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response) {
        OAuth2AuthorizationRequest authRequest = loadAuthorizationRequest(request);

        Cookie cookie = new Cookie(OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);

        boolean isSecure = isSecureRequest(request);
        cookie.setSecure(isSecure);
        if (isSecure) {
            cookie.setAttribute("SameSite", "None");
        }

        response.addCookie(cookie);

        return authRequest;
    }

    private static boolean isSecureRequest(HttpServletRequest request) {
        return request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
    }

    private Optional<Cookie> fetchCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return Optional.of(cookie);
                }
            }
        }
        return Optional.empty();
    }

    private String serialize(OAuth2AuthorizationRequest authorizationRequest) {
        try {
            CompactAuthRequest compact = new CompactAuthRequest(authorizationRequest);
            byte[] json = MAPPER.writeValueAsBytes(compact);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            try (GZIPOutputStream gzip = new GZIPOutputStream(bos)) {
                gzip.write(json);
            }
            return Base64.getUrlEncoder().withoutPadding().encodeToString(bos.toByteArray());
        } catch (Exception e) {
            log.error("Failed to serialize OAuth2AuthorizationRequest: {}", e.getMessage(), e);
            throw new IllegalArgumentException("Failed to serialize OAuth2AuthorizationRequest", e);
        }
    }

    private OAuth2AuthorizationRequest deserialize(String cookie) {
        try {
            byte[] compressed = Base64.getUrlDecoder().decode(cookie);
            ByteArrayInputStream bis = new ByteArrayInputStream(compressed);
            byte[] json;
            try (GZIPInputStream gzip = new GZIPInputStream(bis)) {
                json = gzip.readAllBytes();
            }
            CompactAuthRequest compact = MAPPER.readValue(json, CompactAuthRequest.class);
            return compact.toAuthorizationRequest();
        } catch (Exception e) {
            // Also try legacy Java serialization format for backward compatibility
            try {
                return deserializeLegacy(cookie);
            } catch (Exception legacyEx) {
                log.error("Failed to deserialize OAuth2 authorization request cookie: {} (also tried legacy format: {})",
                        e.getMessage(), legacyEx.getMessage());
                return null;
            }
        }
    }

    /**
     * Backward-compatible deserializer for cookies written with the old Java ObjectOutputStream format.
     * This handles in-flight auth requests during deployment transitions.
     */
    private OAuth2AuthorizationRequest deserializeLegacy(String cookie) throws Exception {
        ByteArrayInputStream bis = new ByteArrayInputStream(Base64.getUrlDecoder().decode(cookie));
        try (GZIPInputStream gzip = new GZIPInputStream(bis);
             java.io.ObjectInputStream ois = new java.io.ObjectInputStream(gzip)) {
            return (OAuth2AuthorizationRequest) ois.readObject();
        }
    }
}
