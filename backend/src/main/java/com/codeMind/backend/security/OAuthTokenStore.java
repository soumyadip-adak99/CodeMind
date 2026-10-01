package com.codeMind.backend.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory store for short-lived one-time OAuth handoff tokens.
 *
 * After a successful GitHub OAuth flow the backend redirects the browser to
 * the frontend with a one-time token (?token=<uuid>). The frontend immediately
 * POSTs that token to /api/auth/exchange; the backend validates it here,
 * creates a real Spring session, and returns the user — so the session cookie
 * is set on the backend's own domain during the exchange request, avoiding
 * any cross-domain cookie issues with Cloudflare tunnel / Vercel.
 *
 * Tokens expire after 2 minutes and are single-use (consumed on first read).
 */
@Component
public class OAuthTokenStore {

    private static final long TTL_SECONDS = 120; // 2 minutes

    private record Entry(Long userId, Instant expiresAt) {}

    private final Map<String, Entry> store = new ConcurrentHashMap<>();

    /**
     * Generate and store a one-time token for the given userId.
     *
     * @return the generated token (UUID string)
     */
    public String generate(Long userId) {
        // Clean up stale tokens opportunistically on each generation
        Instant now = Instant.now();
        store.entrySet().removeIf(e -> e.getValue().expiresAt().isBefore(now));

        String token = UUID.randomUUID().toString();
        store.put(token, new Entry(userId, now.plusSeconds(TTL_SECONDS)));
        return token;
    }

    /**
     * Consume a token.  Returns the userId if the token exists and has not
     * expired; removes it from the store in all cases.
     *
     * @return the userId, or null if the token is invalid / expired
     */
    public Long consume(String token) {
        Entry entry = store.remove(token);
        if (entry == null) return null;
        if (entry.expiresAt().isBefore(Instant.now())) return null;
        return entry.userId();
    }
}
