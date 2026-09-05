package com.codeMind.backend.security;

import com.codeMind.backend.entity.User;
import com.codeMind.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GitHubOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public @Nullable OAuth2User loadUser(@NonNull OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // load user
        OAuth2User githubUser = delegate.loadUser(userRequest);

        // load access-token
        String accessToken = userRequest.getAccessToken().getTokenValue();

        // load scops
        String scops = userRequest.getAccessToken().getScopes() != null ? String.join(",", userRequest.getAccessToken().getScopes()) : "read:user,repo";

        // get user front entity
        User user = userService.upsertFromGitHub(githubUser.getAttributes(), accessToken, scops);

        return new AppUserPrincipal(user, githubUser.getAttributes());
    }
}
