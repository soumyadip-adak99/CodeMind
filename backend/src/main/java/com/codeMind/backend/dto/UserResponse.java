package com.codeMind.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    UUID id;

    Long gitHubId;

    String gitHubUserName;

    String displayName;

    String avatarUrl;
}
