package com.codeMind.backend.constant;

public class AppConstant {

    public static String[] PUBLIC_ENDPOINTS = {
            "/api/auth/login-url",
            "/oauth2/**",
            "/login/oauth2/**",
            "/error"
    };


    private AppConstant() {
    }
}
