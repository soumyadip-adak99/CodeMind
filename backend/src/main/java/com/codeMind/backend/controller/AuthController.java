package com.codeMind.backend.controller;

import com.codeMind.backend.constant.AppConstant;
import com.codeMind.backend.dto.response.UserResponse;
import com.codeMind.backend.entity.User;
import com.codeMind.backend.security.AppUserPrincipal;
import com.codeMind.backend.security.CurrentUser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {


    private final CurrentUser currentUser;

    @GetMapping("/login-url")
    public ResponseEntity<Map<String, String>> loginUrl() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("url", "/oauth2/authorization/github"));
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
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. Invalidate the server-side session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // 2. Clear the Spring Security context
        SecurityContextHolder.clearContext();

        // 3. Expire the session cookie in the browser
        Cookie sessionCookie = new Cookie(AppConstant.SESSION_COOKIE_NAME, "");
        sessionCookie.setMaxAge(0);
        sessionCookie.setPath("/");
        sessionCookie.setHttpOnly(true);
        response.addCookie(sessionCookie);

        // 4. Instruct the browser to wipe all cookies for this origin
        response.setHeader("Clear-Site-Data", "\"cookies\"");

        return ResponseEntity.noContent().build();
    }
}