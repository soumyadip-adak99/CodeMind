package com.codeMind.backend.dto;

import com.codeMind.backend.enums.IndexStatus;
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
public class IndexStatusResponse {
    private UUID repositoryId;
    private IndexStatus indexStatus;
    private int filesTotal;
    private int filesProcessed;
    private int chunkCount;
    Instant indexedAt;
    String errorMessage;
}
