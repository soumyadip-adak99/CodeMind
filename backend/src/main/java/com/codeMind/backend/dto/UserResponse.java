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
    private UUID id;

    private Long gitHubId;

    private String gitHubUserName;

    private String displayName;

    private String avatarUrl;
}
