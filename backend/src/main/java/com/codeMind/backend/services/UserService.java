package com.codeMind.backend.services;

import com.codeMind.backend.entity.User;

import java.util.Map;
import java.util.UUID;

public interface UserService {

    User requiredById(UUID id);

    String decryptAccessToken(User user);

    User upsertFromGitHub(Map<String, Object> attributes, String accessToken, String scopes);
}