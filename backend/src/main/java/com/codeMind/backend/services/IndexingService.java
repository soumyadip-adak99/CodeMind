package com.codeMind.backend.services;

import com.codeMind.backend.entity.GitHubRepository;

import java.util.UUID;

public interface IndexingService {

    GitHubRepository startIndexing(UUID repoId, UUID userId);

    void indexAsync(UUID repoId, UUID userId);

}
