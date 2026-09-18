package com.codeMind.backend.dto.response;

import com.codeMind.backend.dto.CitationDto;
import com.codeMind.backend.enums.MessageRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private UUID id;
    private MessageRole role;
    private List<CitationDto> citations;
    private Instant createdAt;
}
