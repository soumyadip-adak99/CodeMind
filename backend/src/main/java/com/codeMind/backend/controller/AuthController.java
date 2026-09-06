package com.codeMind.backend.controller;

import com.codeMind.backend.dto.UserResponse;
import com.codeMind.backend.entity.User;
import com.codeMind.backend.security.AppUserPrincipal;
import com.codeMind.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping
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
}
