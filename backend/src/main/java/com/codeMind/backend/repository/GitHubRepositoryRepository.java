package com.codeMind.backend.repository;

import com.codeMind.backend.entity.GitHubRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface GitHubRepositoryRepository extends JpaRepository<GitHubRepository, UUID> {

    List<GitHubRepository> findByUserIdOrderByFullNameAsc(UUID userId);

    Optional<GitHubRepository> findByIdAndUserId(UUID repoId, UUID userId);

    Optional<GitHubRepository> findByUserIdAndGithubRepoId(UUID userId, Long githubRepoId);
}
