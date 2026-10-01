package com.codeMind.backend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class SessionUtil {

    public void setCookieWithSecurity(HttpServletRequest request, Cookie cookie) {
        boolean isSecure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
        cookie.setSecure(isSecure);
        if (isSecure) {
            cookie.setAttribute("SameSite", "None");
        } else {
            cookie.setAttribute("SameSite", "Lax");
        }
    }

    public void setAccessTokenCookie(HttpServletRequest request, HttpServletResponse response, String accessToken) {
        Cookie cookie = new Cookie("codemind_access_token", accessToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60); // 15 mins
        setCookieWithSecurity(request, cookie);
        response.addCookie(cookie);
    }

    public void setRefreshTokenCookie(HttpServletRequest request, HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("codemind_refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        setCookieWithSecurity(request, cookie);
        response.addCookie(cookie);
    }

    public void setSessionCookie(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = new Cookie("CODEMIND_SESSION", "1");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
        setCookieWithSecurity(request, cookie);
        response.addCookie(cookie);
    }

    public void clearCookies(HttpServletRequest request, HttpServletResponse response) {
        Cookie accessCookie = new Cookie("codemind_access_token", "");
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        accessCookie.setHttpOnly(true);
        setCookieWithSecurity(request, accessCookie);
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("codemind_refresh_token", "");
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/api/auth/refresh");
        refreshCookie.setHttpOnly(true);
        setCookieWithSecurity(request, refreshCookie);
        response.addCookie(refreshCookie);

        Cookie sessionCookie = new Cookie("CODEMIND_SESSION", "");
        sessionCookie.setMaxAge(0);
        sessionCookie.setPath("/");
        sessionCookie.setHttpOnly(true);
        setCookieWithSecurity(request, sessionCookie);
        response.addCookie(sessionCookie);
    }
}
