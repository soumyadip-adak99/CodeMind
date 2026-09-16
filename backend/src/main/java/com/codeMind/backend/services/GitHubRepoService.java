package com.codeMind.backend.services;

import com.codeMind.backend.dto.GitHubRepositoryResponse;
import com.codeMind.backend.dto.IndexStatusResponse;
import com.codeMind.backend.entity.GitHubRepository;

import java.util.List;
import java.util.UUID;

public interface GitHubRepoService {

    List<GitHubRepositoryResponse> syncAndListRepos(UUID userId);

    List<GitHubRepositoryResponse> listSorted(UUID userId);

    GitHubRepository requireOwned(UUID repoId, UUID userId);

    IndexStatusResponse status(UUID repoId, UUID userId);

    GitHubRepositoryResponse toResponse(GitHubRepository repository);
}
