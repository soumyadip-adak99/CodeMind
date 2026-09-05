package com.codeMind.backend.services.impl;

import com.codeMind.backend.entity.User;
import com.codeMind.backend.repository.UserRepository;
import com.codeMind.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TextEncryptor textEncryptor;

    @Override
    public User requiredById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
