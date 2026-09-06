package com.codeMind.backend.config;

import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.encrypt.AesCbcBytesEncryptor;
import org.springframework.security.crypto.encrypt.TextEncryptor;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Configuration
public class EncryptionConfig {

    @Value("${app.encrypt.password}")
    private String password;

    @Value("${app.encrypt.salt}")
    private String salt;

    @Bean
    public TextEncryptor textEncryptor() {
        AesCbcBytesEncryptor bytesEncryptor = AesCbcBytesEncryptor.withPassword(password, salt).build();

        return new TextEncryptor() {
            @Override
            public @NonNull String encrypt(@NonNull String text) {
                byte[] encrypted = bytesEncryptor.encrypt(text.getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(encrypted);
            }

            @Override
            public @NonNull String decrypt(@NonNull String encryptedText) {
                byte[] decoded = Base64.getDecoder().decode(encryptedText);
                byte[] decrypted = bytesEncryptor.decrypt(decoded);
                return new String(decrypted, StandardCharsets.UTF_8);
            }
        };
    }
}
