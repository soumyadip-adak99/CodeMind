package com.codeMind.backend.services.implementation;

import com.codeMind.backend.dto.response.GitHubRepositoryResponse;
import com.codeMind.backend.dto.response.IndexStatusResponse;
import com.codeMind.backend.entity.GitHubRepository;
import com.codeMind.backend.entity.User;
import com.codeMind.backend.exceptions.NotFoundException;
import com.codeMind.backend.repository.GitHubRepositoryRepository;
import com.codeMind.backend.services.GitHubRepoService;
import com.codeMind.backend.services.UserService;
import com.codeMind.backend.services.github.GitHubApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GitHubRepoServiceImpl implements GitHubRepoService {

    private final GitHubRepositoryRepository repository;
    private final UserService userService;
    private final GitHubApiClient gitHubApiClient;

    @Override
    @Transactional
    public List<GitHubRepositoryResponse> syncAndListRepos(UUID userId) {
        User user = userService.requiredById(userId);
        String token = userService.decryptAccessToken(user);
        List<Map<String, Object>> remoteRepos = gitHubApiClient.listUserRepos(token);

        List<GitHubRepository> saved = new ArrayList<>();

        for (Map<String, Object> remote : remoteRepos) {
            Long githubRepoId = toLong(remote.get("id"));
            GitHubRepository repo = repository.findByUserIdAndGithubRepoId(userId, githubRepoId).orElseGet(GitHubRepository::new);
            String fullName = String.valueOf(remote.get("full_name"));
            String[] parts = fullName.split("/", 2);

            repo.setUserId(userId);
            repo.setGithubRepoId(githubRepoId);
            repo.setOwner(parts.length > 0 ? parts[0] : String.valueOf(remote.get("owner")));
            repo.setName(parts.length > 1 ? parts[1] : String.valueOf(remote.get("name")));
            repo.setFullName(fullName);
            repo.setPrivate(Boolean.TRUE.equals(remote.get("private")));
            repo.setDefaultBranch(remote.get("default_branch") != null ? String.valueOf(remote.get("default_branch")) : "main");
            repo.setLanguage(remote.get("language") != null ? String.valueOf(remote.get("language")) : null);
            repo.setHtmlUrl(remote.get("html_url") != null ? String.valueOf(remote.get("html_url")) : null);
            repo.setDescription(remote.get("description") != null ? String.valueOf(remote.get("description")) : null);
            if (repo.getOwner() == null || repo.getOwner().isBlank()) {
                Object ownObj = remote.get("owner");
                if (ownObj instanceof Map<?, ?> ownerMap && ownerMap.get("login") != null) {
                    repo.setOwner(String.valueOf(ownerMap.get("login")));
                }
            }
            saved.add(repository.save(repo));
        }

        return saved.stream()
                .sorted((a, b) -> a.getFullName().compareToIgnoreCase(b.getFullName()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GitHubRepositoryResponse> listSorted(UUID userId) {
        return repository.findByUserIdOrderByFullNameAsc(userId).stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GitHubRepository requireOwned(UUID repoId, UUID userId) {
        return repository.findByIdAndUserId(repoId, userId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public IndexStatusResponse status(UUID repoId, UUID userId) {
        GitHubRepository repo = requireOwned(repoId, userId);
        return IndexStatusResponse.builder()
                .repositoryId(repo.getId())
                .indexStatus(repo.getIndexStatus())
                .filesTotal(repo.getFilesTotal())
                .filesProcessed(repo.getFilesProcessed())
                .chunkCount(repo.getChunkCount())
                .indexedAt(repo.getIndexedAt())
                .errorMessage(repo.getErrorMessage())
                .build();
    }

    @Override
    public GitHubRepositoryResponse toResponse(GitHubRepository repo) {
        return GitHubRepositoryResponse.builder()
                .id(repo.getId())
                .userId(repo.getUserId())
                .githubRepoId(repo.getGithubRepoId())
                .owner(repo.getOwner())
                .name(repo.getName())
                .fullName(repo.getFullName())
                .isPrivate(repo.isPrivate())
                .defaultBranch(repo.getDefaultBranch())
                .language(repo.getLanguage())
                .htmlUrl(repo.getHtmlUrl())
                .description(repo.getDescription())
                .indexStatus(repo.getIndexStatus())
                .indexedAt(repo.getIndexedAt())
                .chunkCount(repo.getChunkCount())
                .filesTotal(repo.getFilesTotal())
                .filesProcessed(repo.getFilesProcessed())
                .errorMessage(repo.getErrorMessage())
                .createdAt(repo.getCreatedAt())
                .updatedAt(repo.getUpdatedAt())
                .build();
    }

    private static Long toLong(Object value) {
        if (value instanceof Number number)
            return number.longValue();
        return Long.parseLong(String.valueOf(value));
    }
}
