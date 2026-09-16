package com.codeMind.backend.controller;

import com.codeMind.backend.dto.GitHubRepositoryResponse;
import com.codeMind.backend.dto.IndexStatusResponse;
import com.codeMind.backend.security.CurrentUser;
import com.codeMind.backend.services.GitHubRepoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/repos")
@RequiredArgsConstructor
public class RepoController {

    private final CurrentUser currentUser;
    private final GitHubRepoService repoService;

    @GetMapping
    public ResponseEntity<List<GitHubRepositoryResponse>> getListOfRepos(
            @RequestParam(name = "refresh", defaultValue = "true")
            boolean refresh
    ) {
        UUID userId = currentUser.require().getId();
        if (refresh) {
            return new ResponseEntity<>(repoService.syncAndListRepos(userId), HttpStatus.OK);
        }
        return new ResponseEntity<>(repoService.listSorted(userId), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GitHubRepositoryResponse> getGithubRepository(@PathVariable UUID id) {
        UUID userId = currentUser.require().getId();
        return new ResponseEntity<>(repoService.toResponse(repoService.requireOwned(id, userId)), HttpStatus.OK);
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<IndexStatusResponse> getRepoStatus(@PathVariable UUID id) {
        return new ResponseEntity<>(repoService.status(id, currentUser.require().getId()), HttpStatus.OK);
    }
}
