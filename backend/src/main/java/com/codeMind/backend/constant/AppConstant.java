package com.codeMind.backend.constant;

public class AppConstant {

    public static String[] PUBLIC_ENDPOINTS = {
            "/api/auth/login-url",
            "/api/auth/logout",
            "/oauth2/**",
            "/login/oauth2/**",
            "/error"
    };

    public static final String SESSION_COOKIE_NAME = "CODEMIND_SESSION";

    private AppConstant() {
    }
}
