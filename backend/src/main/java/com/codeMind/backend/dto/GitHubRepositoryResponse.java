package com.codeMind.backend.dto;

import com.codeMind.backend.enums.IndexStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GitHubRepositoryResponse {

    private UUID id;

    private UUID userId;

    private Long githubRepoId;

    private String owner;

    private String fullName;

    private String name;

    @JsonProperty("isPrivate")
    private boolean isPrivate;

    private String defaultBranch;

    private String language;

    private String htmlUrl;

    private String description;

    private IndexStatus indexStatus;

    private Instant indexedAt;

    private int chunkCount;

    private int filesTotal;

    private int filesProcessed;

    private String errorMessage;

    private Instant createdAt;

    private Instant updatedAt;
}