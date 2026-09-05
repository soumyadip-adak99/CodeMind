package com.codeMind.backend.services;

import com.codeMind.backend.entity.User;

import java.util.UUID;

public interface UserService {

    User requiredById(UUID id);
}
