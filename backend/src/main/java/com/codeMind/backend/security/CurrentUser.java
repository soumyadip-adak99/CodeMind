package com.codeMind.backend.security;

import com.codeMind.backend.exceptions.UnauthorisedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public AppUserPrincipal require() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !((auth.getPrincipal()) instanceof AppUserPrincipal principal)) {
            throw new UnauthorisedException("Not authenticated");
        }

        return principal;
    }
}
